import crypto from 'crypto';
import { db } from '../db/database';

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FAILED_ATTEMPTS = 5;

// In-memory rate limiting tracker: ip -> { attempts: number, resetAt: number }
const rateLimitMap = new Map<string, { attempts: number; resetAt: number }>();

function hashPassword(token: string, salt: string): string {
  return crypto.pbkdf2Sync(token, salt, 100_000, 64, 'sha512').toString('hex');
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return false;
  if (now > entry.resetAt) {
    rateLimitMap.delete(ip);
    return false;
  }
  return entry.attempts >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { attempts: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.attempts = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  } else {
    entry.attempts += 1;
  }
  rateLimitMap.set(ip, entry);
}

export function clearRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

export function isDatabaseInitialized(): boolean {
  const admin = db.prepare('SELECT id FROM admin_credentials WHERE id = 1').get();
  return !!admin;
}

export function initializeAdminToken(token: string): boolean {
  if (isDatabaseInitialized()) {
    return false;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const tokenHash = hashPassword(token, salt);
  const now = Date.now();

  const insert = db.prepare(`
    INSERT INTO admin_credentials (id, token_hash, salt, created_at)
    VALUES (1, ?, ?, ?)
  `);
  insert.run(tokenHash, salt, now);
  return true;
}

export function verifyAdminToken(token: string): boolean {
  const admin = db.prepare('SELECT token_hash, salt FROM admin_credentials WHERE id = 1').get() as {
    token_hash: string;
    salt: string;
  } | undefined;

  if (!admin) return false;

  const testHash = hashPassword(token, admin.salt);
  const testBuffer = Buffer.from(testHash, 'hex');
  const targetBuffer = Buffer.from(admin.token_hash, 'hex');

  if (testBuffer.length !== targetBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(testBuffer, targetBuffer);
}

export function createSession(): { sessionId: string; expiresAt: Date } {
  const rawSession = crypto.randomBytes(32).toString('hex');
  const idHash = crypto.createHash('sha256').update(rawSession).digest('hex');
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  db.prepare(`
    INSERT INTO admin_sessions (id_hash, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?)
  `).run(idHash, expiresAt, now, now);

  return {
    sessionId: rawSession,
    expiresAt: new Date(expiresAt),
  };
}

export function validateSession(sessionId?: string): boolean {
  if (!sessionId) return false;
  const idHash = crypto.createHash('sha256').update(sessionId).digest('hex');
  const now = Date.now();

  const session = db.prepare('SELECT expires_at FROM admin_sessions WHERE id_hash = ?').get(idHash) as {
    expires_at: number;
  } | undefined;

  if (!session) return false;

  if (now > session.expires_at) {
    db.prepare('DELETE FROM admin_sessions WHERE id_hash = ?').run(idHash);
    return false;
  }

  // Update last seen and slide expiration window if active
  db.prepare('UPDATE admin_sessions SET last_seen_at = ?, expires_at = ? WHERE id_hash = ?').run(
    now,
    now + SESSION_TTL_MS,
    idHash
  );

  return true;
}

export function destroySession(sessionId?: string) {
  if (!sessionId) return;
  const idHash = crypto.createHash('sha256').update(sessionId).digest('hex');
  db.prepare('DELETE FROM admin_sessions WHERE id_hash = ?').run(idHash);
}
