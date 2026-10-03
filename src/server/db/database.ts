import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { INITIAL_SITE_CONTENT, INITIAL_SHOUTBOX_MESSAGES } from '../../shared/constants/initialData';
import { SiteContent, ShoutboxMessage } from '../../shared/types';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'deathroll.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Optimize SQLite for production
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');
db.exec('PRAGMA busy_timeout = 5000;');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      schema_version INTEGER NOT NULL,
      revision INTEGER NOT NULL,
      document_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      token_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      rotated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id_hash TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shoutbox_messages (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      city TEXT NOT NULL,
      message TEXT NOT NULL,
      favorite_track TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  // Seed site_content if not exists
  const existing = db.prepare('SELECT id FROM site_content WHERE id = 1').get();
  if (!existing) {
    const now = Date.now();
    const docJson = JSON.stringify(INITIAL_SITE_CONTENT);
    db.prepare(`
      INSERT INTO site_content (id, schema_version, revision, document_json, created_at, updated_at)
      VALUES (1, 1, 1, ?, ?, ?)
    `).run(docJson, now, now);
    console.log('🎸 Seeded default DEATHROLL site content into SQLite database.');
  }

  // Seed shoutbox if empty
  const shoutCount = db.prepare('SELECT COUNT(*) as count FROM shoutbox_messages').get() as { count: number };
  if (Number(shoutCount.count) === 0) {
    const insertShout = db.prepare(`
      INSERT INTO shoutbox_messages (id, author_name, city, message, favorite_track, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const msg of INITIAL_SHOUTBOX_MESSAGES) {
      insertShout.run(
        msg.id,
        msg.authorName,
        msg.city,
        msg.message,
        msg.favoriteTrack || '',
        new Date(msg.createdAt).getTime()
      );
    }
  }
}

export function getStoredSiteContent(): { content: SiteContent; revision: number; updatedAt: string } {
  const row = db.prepare('SELECT revision, document_json, updated_at FROM site_content WHERE id = 1').get() as {
    revision: number;
    document_json: string;
    updated_at: number;
  } | undefined;

  if (!row) {
    return {
      content: INITIAL_SITE_CONTENT,
      revision: 1,
      updatedAt: new Date().toISOString(),
    };
  }

  const content = JSON.parse(row.document_json) as SiteContent;
  // Ensure backward compatibility if new arrays were added
  if (!content.merchandise) content.merchandise = INITIAL_SITE_CONTENT.merchandise;
  if (!content.videos) content.videos = INITIAL_SITE_CONTENT.videos;

  return {
    content,
    revision: Number(row.revision),
    updatedAt: new Date(Number(row.updated_at)).toISOString(),
  };
}

export function updateStoredSiteContent(newContent: SiteContent, expectedRevision: number): { revision: number; updatedAt: string } {
  const current = db.prepare('SELECT revision FROM site_content WHERE id = 1').get() as { revision: number } | undefined;
  
  if (!current) {
    throw new Error('SITE_NOT_FOUND');
  }

  if (Number(current.revision) !== expectedRevision) {
    throw new Error('REVISION_CONFLICT');
  }

  const nextRevision = Number(current.revision) + 1;
  const now = Date.now();
  newContent.updatedAt = new Date(now).toISOString();
  const docJson = JSON.stringify(newContent);

  const updateStmt = db.prepare(`
    UPDATE site_content
    SET revision = ?, document_json = ?, updated_at = ?
    WHERE id = 1 AND revision = ?
  `);

  const result = updateStmt.run(nextRevision, docJson, now, expectedRevision);
  if (result.changes === 0) {
    throw new Error('REVISION_CONFLICT');
  }

  return {
    revision: nextRevision,
    updatedAt: newContent.updatedAt,
  };
}

export function getShoutboxMessages(): ShoutboxMessage[] {
  const rows = db.prepare('SELECT * FROM shoutbox_messages ORDER BY created_at DESC LIMIT 50').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    authorName: r.author_name,
    city: r.city,
    message: r.message,
    favoriteTrack: r.favorite_track || undefined,
    createdAt: new Date(Number(r.created_at)).toISOString(),
  }));
}

export function insertShoutboxMessage(input: { authorName: string; city: string; message: string; favoriteTrack?: string }): ShoutboxMessage {
  const id = `shout-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = Date.now();
  db.prepare(`
    INSERT INTO shoutbox_messages (id, author_name, city, message, favorite_track, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, input.authorName, input.city, input.message, input.favoriteTrack || '', now);

  return {
    id,
    authorName: input.authorName,
    city: input.city,
    message: input.message,
    favoriteTrack: input.favoriteTrack,
    createdAt: new Date(now).toISOString(),
  };
}

export function deleteShoutboxMessage(id: string) {
  db.prepare('DELETE FROM shoutbox_messages WHERE id = ?').run(id);
}
