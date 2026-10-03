import express, { Request, Response } from 'express';
import { parse as parseCookies, serialize as serializeCookie } from 'cookie';
import {
  getStoredSiteContent,
  updateStoredSiteContent,
  getShoutboxMessages,
  insertShoutboxMessage,
  deleteShoutboxMessage,
} from '../db/database';
import {
  isDatabaseInitialized,
  initializeAdminToken,
  verifyAdminToken,
  createSession,
  validateSession,
  destroySession,
  isRateLimited,
  recordFailedAttempt,
  clearRateLimit,
} from '../auth/authService';
import {
  InitializeAdminInputSchema,
  LoginAdminInputSchema,
  SaveSiteInputSchema,
  CreateShoutInputSchema,
} from '../../shared/schemas/site';

const router = express.Router();
const SESSION_COOKIE_NAME = 'deathroll_admin_session';

function getSessionId(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME];
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// GET /api/content
router.get('/content', (req: Request, res: Response) => {
  try {
    const data = getStoredSiteContent();
    res.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
});

// GET /api/shoutbox
router.get('/shoutbox', (req: Request, res: Response) => {
  try {
    const messages = getShoutboxMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching shouts:', error);
    res.status(500).json({ error: 'Failed to fetch shoutbox messages' });
  }
});

// POST /api/shoutbox
router.post('/shoutbox', (req: Request, res: Response) => {
  const parsed = CreateShoutInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Input shoutbox tidak valid' });
    return;
  }

  try {
    const message = insertShoutboxMessage(parsed.data);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating shout:', error);
    res.status(500).json({ error: 'Gagal mengirim pesan ke shoutbox' });
  }
});

// DELETE /api/admin/shoutbox/:id
router.delete('/admin/shoutbox/:id', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  if (!validateSession(sessionId)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    deleteShoutboxMessage(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pesan shoutbox' });
  }
});

// GET /api/admin/state
router.get('/admin/state', (req: Request, res: Response) => {
  const initialized = isDatabaseInitialized();
  const sessionId = getSessionId(req);
  const authenticated = initialized && validateSession(sessionId);

  res.json({
    initialized,
    authenticated,
  });
});

// POST /api/admin/initialize
router.post('/admin/initialize', (req: Request, res: Response) => {
  const parsed = InitializeAdminInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Input tidak valid' });
    return;
  }

  const success = initializeAdminToken(parsed.data.token);
  if (!success) {
    res.status(403).json({ error: 'Admin sudah pernah diinisialisasi.' });
    return;
  }

  const session = createSession();
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE_NAME, session.sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60,
    })
  );

  res.json({ message: 'Inisialisasi berhasil. Mode admin aktif.' });
});

// POST /api/admin/login
router.post('/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Terlalu banyak percobaan login yang gagal. Silakan coba 10 menit lagi.' });
    return;
  }

  const parsed = LoginAdminInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Token admin wajib diisi' });
    return;
  }

  const valid = verifyAdminToken(parsed.data.token);
  if (!valid) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: 'Token admin salah atau tidak valid.' });
    return;
  }

  clearRateLimit(ip);
  const session = createSession();
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE_NAME, session.sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60,
    })
  );

  res.json({ message: 'Login berhasil.', expiresAt: session.expiresAt.toISOString() });
});

// POST /api/admin/logout
router.post('/admin/logout', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  destroySession(sessionId);

  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })
  );

  res.json({ message: 'Logout berhasil.' });
});

// POST /api/admin/content
router.post('/admin/content', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  if (!validateSession(sessionId)) {
    res.status(401).json({ error: 'Sesi admin kedaluwarsa atau tidak valid. Silakan login kembali.' });
    return;
  }

  const parsed = SaveSiteInputSchema.safeParse(req.body);
  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.format());
    res.status(400).json({
      error: 'Data konten tidak valid',
      details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
    });
    return;
  }

  try {
    const result = updateStoredSiteContent(parsed.data.content, parsed.data.expectedRevision);
    res.json(result);
  } catch (err: any) {
    if (err.message === 'REVISION_CONFLICT') {
      const current = getStoredSiteContent();
      res.status(409).json({
        error: 'REVISION_CONFLICT',
        message: 'Konten di server telah diperbarui oleh sesi lain. Muat ulang untuk melihat perubahan terbaru.',
        currentRevision: current.revision,
      });
      return;
    }
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Gagal menyimpan konten ke database.' });
  }
});

export default router;
