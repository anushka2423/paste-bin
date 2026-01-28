// Custom Express server for local development (optional)
// For production/Vercel, Next.js handles everything automatically
import express from 'express';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Let Next.js handle all routes (including API routes via App Router)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> Health check: http://localhost:${PORT}/api/healthz`);
  });
});
