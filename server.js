import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STUDENTS_FILE = path.join(__dirname, 'data', 'students.json');

function readLocalStudents() {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      const content = fs.readFileSync(STUDENTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Error reading students.json:", err.message);
  }
  return [];
}

function writeLocalStudents(studentsList) {
  try {
    const dir = path.dirname(STUDENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(studentsList, null, 2), 'utf-8');
  } catch (err) {
    console.warn("Error writing students.json:", err.message);
  }
}

import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Global Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Admin Authentication & HMAC Session Token Utilities
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'credible-create-secret-token-key-2026';

function generateAdminToken(email) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours
  const payload = `${email}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [email, expiresAtStr, hmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const expectedHmac = crypto.createHmac('sha256', JWT_SECRET).update(`${email}:${expiresAtStr}`).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return { email, role: 'admin' };
    }
  } catch (err) {
    return null;
  }
  return null;
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token || '');
  const user = verifyAdminToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Valid admin authentication token required' });
  }
  req.adminUser = user;
  next();
}

// In-Memory Login Rate Limiter (Max 5 attempts per 15 minutes per IP)
const loginAttempts = new Map();

function isRateLimited(ip) {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() > record.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.attempts >= 5;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, resetTime: now + 15 * 60 * 1000 };
  record.attempts += 1;
  loginAttempts.set(ip, record);
}

function resetLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

// Serve dynamic config script to frontend to avoid hardcoding secrets
app.get('/js/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = ${JSON.stringify({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL,
    GET_IN_TOUCH_APPS_SCRIPT_URL: process.env.GET_IN_TOUCH_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL
  })};`);
});

// Endpoint to post Get In Touch contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!email || !email.trim() || !name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const contactPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      message: (message || '').trim(),
      timestamp: new Date().toISOString()
    };

    const appsScriptUrl = process.env.GET_IN_TOUCH_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(contactPayload)
      }).catch(err => console.warn("Get In Touch Apps Script forward notice:", err.message));
    }

    res.json({ success: true, contact: contactPayload });
  } catch (err) {
    console.error("Error creating contact submission:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Authentication endpoint with rate-limiting and HMAC token issuance
app.post('/api/auth/login', (req, res) => {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ success: false, error: 'Too many failed login attempts. Please try again after 15 minutes.' });
  }

  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@crediblecreate.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
    resetLoginAttempts(clientIp);
    const token = generateAdminToken(email);
    res.json({ success: true, token, user: { email, role: 'admin' } });
  } else {
    recordFailedAttempt(clientIp);
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }
});

// Endpoint to verify active admin session
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token || '');
  const user = verifyAdminToken(token);
  if (user) {
    return res.json({ success: true, user });
  }
  res.status(401).json({ success: false, error: 'No active admin session' });
});


function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const parseLine = (line) => {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') inQuotes = !inQuotes;
      else if (c === ',' && !inQuotes) { res.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    res.push(cur.trim());
    return res;
  };
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const k = headers[j].replace(/^"|"$/g, '');
      obj[k] = (vals[j] || '').replace(/^"|"$/g, '');
    }
    rows.push(obj);
  }
  return rows;
}

// Supabase Database Helpers for Demo Requests / Student Registrations
async function fetchSupabaseDemoRequests() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/demo_requests?select=*&order=created_at.desc`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(item => ({
          id: item.id,
          name: item.full_name || item.name || 'N/A',
          email: item.email || 'N/A',
          institution: item.institution_name || item.institution || 'N/A',
          interest: item.program_interest || item.interest || 'Robotics',
          level: item.level || 'school',
          class_course: item.class_course || 'N/A',
          status: item.status || 'pending',
          date: item.created_at || new Date().toISOString()
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase fetch notice:", err.message);
  }
  return null;
}

async function insertSupabaseDemoRequest(studentData) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  try {
    const payload = {
      full_name: studentData.name,
      email: studentData.email,
      institution_name: studentData.institution,
      program_interest: studentData.interest,
      level: studentData.level,
      class_course: studentData.class_course,
      status: 'pending'
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/demo_requests`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Supabase insert notice:", err.message);
  }
  return null;
}

// Endpoint to fetch Student registrations (Supabase Database + Local Store) - Protected by Admin Auth
app.get('/api/admin/students', requireAdminAuth, async (req, res) => {
  const localData = readLocalStudents();
  const remoteStudents = await fetchSupabaseDemoRequests();

  if (remoteStudents && Array.isArray(remoteStudents) && remoteStudents.length > 0) {
    const existingEmails = new Set(remoteStudents.map(s => (s.email || '').toLowerCase()).filter(Boolean));
    const nonDuplicateLocal = localData.filter(s => !existingEmails.has((s.email || '').toLowerCase()));
    const combined = [...remoteStudents, ...nonDuplicateLocal];
    return res.json({ success: true, source: 'SUPABASE_DATABASE_LIVE', students: combined });
  }

  // Fallback seamlessly to local store
  res.json({ success: true, source: 'LOCAL_STORE_FALLBACK', students: localData });
});

// Endpoint to post a new student demo submission (Supabase Database + Local Store)
app.post('/api/admin/students', async (req, res) => {
  try {
    const { name, email, institution, interest, level, class_course, class: cls, course } = req.body;
    
    if (!email || !email.trim() || !name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Student name and email are required' });
    }

    const newStudent = {
      id: 'std_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      institution: (institution || 'N/A').trim(),
      interest: (interest || 'Robotics').trim(),
      level: (level || 'school').trim(),
      class_course: (class_course || (level === 'school' ? cls : course) || 'N/A').trim(),
      date: new Date().toISOString()
    };

    const currentList = readLocalStudents();
    currentList.unshift(newStudent);
    writeLocalStudents(currentList);

    // Insert asynchronously into Supabase demo_requests table
    await insertSupabaseDemoRequest(newStudent);

    res.json({ success: true, student: newStudent });
  } catch (err) {
    console.error("Error creating student record:", err);
    res.status(500).json({ success: false, error: err.message });
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
app.get(['/login', '/login.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

// Admin Routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});
app.get('/admin/:page', (req, res) => {
  const pageName = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
  const filePath = path.join(__dirname, 'public', 'admin', pageName);
  res.sendFile(filePath, err => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

// Fallback HTML router for direct clean URLs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` CREDIBLE CREATE SERVER LIVE ON http://localhost:${PORT}`);
    console.log(` Stack: Standard HTML, CSS, JS + Node/Express (Static)`);
    console.log(`==================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
      console.error(`To resolve this on Windows PowerShell, run:`);
      console.error(`  Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`);
      console.error(`Or set a different port via the PORT environment variable (e.g. PORT=3001 npm run dev).\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

export default app;

