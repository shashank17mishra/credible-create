import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve dynamic config script to frontend to avoid hardcoding secrets
app.get('/js/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = ${JSON.stringify({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL
  })};`);
});

// Admin Authentication endpoint checking env secrets
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, user: { email, role: 'admin' } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Clean URL routes
app.get('/programs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'programs.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});
app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo.html'));
});
app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});
app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'download.html'));
});
app.get('/software', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'download.html'));
});
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Fallback HTML router for direct clean URLs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` CREDIBLE CREATE SERVER LIVE ON http://localhost:${PORT}`);
  console.log(` Stack: Standard HTML, CSS, JS + Node/Express (Static)`);
  console.log(`==================================================`);
});
