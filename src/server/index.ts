import express from 'express';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db/database';
import apiRouter from './routes/api';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Initialize SQLite Database
initDatabase();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON Body Parser with limit
app.use(express.json({ limit: '2mb' }));

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// In production, serve static files from dist/client
const isProduction = process.env.NODE_ENV === 'production';
const clientDistPath = path.resolve(process.cwd(), 'dist');

if (isProduction && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⚡ DEATHROLL Band Server running on http://localhost:${PORT}`);
});
