import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env manually (no dotenv package needed in newer node)
try {
  const __dir = dirname(fileURLToPath(import.meta.url));
  const envPath = join(__dir, '../../.env');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
  console.log('✓ .env loaded');
} catch { console.log('⚠ No .env found — AI features require ANTHROPIC_API_KEY'); }

import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_, res) => res.json({ 
  status: 'ok', 
  ai: !!process.env.ANTHROPIC_API_KEY,
  message: 'Havtam Notes backend is running 🌸'
}));

// Routes
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`\n🌸 Havtam Notes backend running on http://localhost:${PORT}`);
  console.log(`   AI: ${process.env.ANTHROPIC_API_KEY ? '✓ configured' : '✗ no API key (add ANTHROPIC_API_KEY to .env)'}`);
  console.log(`   Frontend: open http://localhost:5173\n`);
});
