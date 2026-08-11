import http from 'http';

const routes = [
  '/',
  '/programs',
  '/about',
  '/projects',
  '/verify',
  '/demo',
  '/gallery',
  '/privacy',
  '/terms',
  '/download',
  '/blog',
  '/login',
  '/admin/',
  '/admin/students',
  '/admin/certificates',
  '/admin/users',
  '/admin/payments',
  '/admin/posts',
  '/admin/post-edit',
  '/js/config.js',
  '/api/admin/students'
];

async function testRoutes() {
  console.log('Testing routes on http://localhost:3000 ...\n');
  let allOk = true;

  for (const route of routes) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${route}`, (res) => {
        const status = res.statusCode;
        const statusText = status === 200 ? 'OK' : `FAIL (${status})`;
        console.log(`[${statusText}] ${route}`);
        if (status !== 200) allOk = false;
        resolve();
      }).on('error', (err) => {
        console.log(`[ERROR] ${route} -> ${err.message}`);
        allOk = false;
        resolve();
      });
    });
  }

  console.log('\nResult:', allOk ? 'ALL ROUTES WORKING PERFECTLY! ✅' : 'SOME ROUTES FAILED ❌');
}

testRoutes();
