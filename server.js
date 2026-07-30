import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsers & Session configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'credible-create-super-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory audit logs container
const systemLogs = [
  { id: '1', type: 'SYS.INIT', description: 'Express engine & SQLite database active', time: new Date().toISOString() }
];

function logActivity(type, description) {
  systemLogs.unshift({
    id: Date.now().toString(),
    type,
    description,
    time: new Date().toISOString()
  });
  if (systemLogs.length > 50) systemLogs.pop();
}

// ==========================================================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials. Access denied.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Access denied.' });
    }

    // Set session user payload
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      canManagePosts: user.canManagePosts,
      canManageCertificates: user.canManageCertificates,
      canManagePayments: user.canManagePayments
    };

    logActivity('AUTH.LOGIN', `Terminal session initiated for user ${user.email}`);
    return res.json({ success: true, user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal authentication server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  if (req.session.user) {
    logActivity('AUTH.LOGOUT', `Terminal session disconnected for ${req.session.user.email}`);
  }
  req.session.destroy(() => {
    return res.json({ success: true });
  });
});

app.get('/api/auth/session', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ user: null });
});

// ==========================================================================
// 2. PUBLIC API ENDPOINTS
// ==========================================================================

// Public Certificate Verification
app.get('/api/verify/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const cert = await prisma.certificate.findUnique({
      where: { credentialCode: code }
    });

    if (!cert || !cert.published) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    return res.json(cert);
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

// Public Blog Posts Listing
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    });
    return res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    return res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Public Single Blog Post
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } }
      }
    });

    if (!post || post.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json(post);
  } catch (err) {
    console.error('Fetch post detail error:', err);
    return res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

// ==========================================================================
// 3. ADMIN SECURED API ROUTER & MIDDLEWARE
// ==========================================================================

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthenticated session' });
  }
  const role = req.session.user.role;
  if (role !== 'SUPER_ADMIN' && role !== 'SUB_ADMIN') {
    return res.status(403).json({ error: 'Forbidden access' });
  }
  next();
}

function requireSuperAdmin(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }
  next();
}

// Admin System Stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [postsCount, certificatesCount, paymentsCount, usersCount, paymentsAgg] = await Promise.all([
      prisma.post.count(),
      prisma.certificate.count(),
      prisma.payment.count(),
      prisma.user.count(),
      prisma.payment.aggregate({ _sum: { amount: true } })
    ]);

    return res.json({
      postsCount,
      certificatesCount,
      paymentsCount,
      paymentsTotal: paymentsAgg._sum.amount || 0,
      usersCount,
      recentLogs: systemLogs.slice(0, 10)
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to load system metrics' });
  }
});

// Enrolled Students list for Certificate generation
app.get('/api/admin/students', requireAdmin, async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true, enrolledCourse: true }
    });
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load students' });
  }
});

// Admin Blog Posts CRUD
app.get('/api/admin/posts', requireAdmin, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } }
    });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load admin posts' });
  }
});

app.post('/api/admin/posts', requireAdmin, async (req, res) => {
  try {
    const { title, slug, content, coverImage, status } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        status: status || 'DRAFT',
        authorId: req.session.user.id
      }
    });

    logActivity('POST.CREATE', `Created blog post "${title}" (${newPost.id})`);
    return res.json(newPost);
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(400).json({ error: err.message || 'Failed to create post' });
  }
});

app.put('/api/admin/posts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, coverImage, status } = req.body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        status: status || 'DRAFT'
      }
    });

    logActivity('POST.UPDATE', `Updated blog post "${title}"`);
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/admin/posts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    logActivity('POST.DELETE', `Deleted blog post ID ${id}`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete post' });
  }
});

// Admin Certificates CRUD
app.get('/api/admin/certificates', requireAdmin, async (req, res) => {
  try {
    const certs = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(certs);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load certificates' });
  }
});

app.post('/api/admin/certificates', requireAdmin, async (req, res) => {
  try {
    const { credentialCode, recipientName, courseTitle, issueDate, published } = req.body;
    if (!credentialCode || !recipientName || !courseTitle) {
      return res.status(400).json({ error: 'Missing required certificate details' });
    }

    const cert = await prisma.certificate.create({
      data: {
        credentialCode: credentialCode.toUpperCase(),
        recipientName,
        courseTitle,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        published: published !== false
      }
    });

    logActivity('CERT.ISSUE', `Issued certificate ${cert.credentialCode} to ${recipientName}`);
    return res.json(cert);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Credential Code already exists' });
  }
});

app.delete('/api/admin/certificates/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await prisma.certificate.delete({ where: { id } });
    logActivity('CERT.REVOKE', `Revoked certificate ${cert.credentialCode}`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to revoke certificate' });
  }
});

// Admin Payments Listing
app.get('/api/admin/payments', requireAdmin, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load payments' });
  }
});

// Admin Users CRUD (Super Admin Only)
app.get('/api/admin/users', requireSuperAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        canManagePosts: true,
        canManageCertificates: true,
        canManagePayments: true,
        createdAt: true
      }
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load users' });
  }
});

app.post('/api/admin/users', requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role, canManagePosts, canManageCertificates, canManagePayments } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash,
        role: role || 'SUB_ADMIN',
        canManagePosts: canManagePosts !== false,
        canManageCertificates: canManageCertificates !== false,
        canManagePayments: canManagePayments === true
      }
    });

    logActivity('USER.CREATE', `Provisioned ${newUser.role} user ${email}`);
    return res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      canManagePosts: newUser.canManagePosts,
      canManageCertificates: newUser.canManageCertificates,
      canManagePayments: newUser.canManagePayments,
      createdAt: newUser.createdAt
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'User already exists' });
  }
});

app.delete('/api/admin/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.session.user.id) {
      return res.status(400).json({ error: 'Cannot revoke your own active terminal session' });
    }
    const user = await prisma.user.delete({ where: { id } });
    logActivity('USER.DELETE', `Revoked user credentials for ${user.email}`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete user' });
  }
});

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

// Fallback HTML router for direct clean URLs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` CREDIBLE CREATE SERVER LIVE ON http://localhost:${PORT}`);
  console.log(` Stack: Standard HTML, CSS, JS + Node/Express & SQLite`);
  console.log(`==================================================`);
});
