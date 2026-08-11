import http from 'http';
import app from '../server.js';

const PORT = 3099;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', err => reject(err));

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runSecurityTests() {
  const server = app.listen(PORT, async () => {
    console.log('==================================================');
    console.log(` RUNNING SECURITY VERIFICATION TESTS ON PORT ${PORT}`);
    console.log('==================================================\n');

    let passedCount = 0;
    let totalCount = 0;

    // Test 1: Unauthenticated access to /api/admin/students (Should be 401 Unauthorized)
    totalCount++;
    try {
      const res1 = await makeRequest('/api/admin/students');
      if (res1.status === 401 && res1.body && res1.body.error && res1.body.error.includes('Unauthorized')) {
        console.log('✅ TEST 1 PASSED: Unauthenticated access to /api/admin/students BLOCKED (401 Unauthorized)');
        passedCount++;
      } else {
        console.log(`❌ TEST 1 FAILED: Expected 401 but got ${res1.status}`, res1.body);
      }
    } catch (err) {
      console.log('❌ TEST 1 ERROR:', err.message);
    }

    // Test 2: Security Headers check
    totalCount++;
    try {
      const res2 = await makeRequest('/');
      const frameOpt = res2.headers['x-frame-options'];
      const contentTypeOpt = res2.headers['x-content-type-options'];
      if (frameOpt === 'DENY' && contentTypeOpt === 'nosniff') {
        console.log('✅ TEST 2 PASSED: Security Headers present (X-Frame-Options: DENY, X-Content-Type-Options: nosniff)');
        passedCount++;
      } else {
        console.log('❌ TEST 2 FAILED: Security Headers missing or invalid:', res2.headers);
      }
    } catch (err) {
      console.log('❌ TEST 2 ERROR:', err.message);
    }

    // Test 3: Invalid Login Attempt
    totalCount++;
    try {
      const res3 = await makeRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email: 'fake@admin.com', password: 'wrongpassword' }
      });
      if (res3.status === 401) {
        console.log('✅ TEST 3 PASSED: Invalid login rejected (401)');
        passedCount++;
      } else {
        console.log(`❌ TEST 3 FAILED: Expected 401 but got ${res3.status}`);
      }
    } catch (err) {
      console.log('❌ TEST 3 ERROR:', err.message);
    }

    // Test 4: Valid Login & Token Generation
    totalCount++;
    let token = null;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crediblecreate.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    try {
      const res4 = await makeRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email: adminEmail, password: adminPass }
      });
      if (res4.status === 200 && res4.body && res4.body.token) {
        token = res4.body.token;
        console.log('✅ TEST 4 PASSED: Valid login succeeded and issued signed token');
        passedCount++;
      } else {
        console.log(`❌ TEST 4 NOTICE: Login returned status ${res4.status}`, res4.body);
      }
    } catch (err) {
      console.log('❌ TEST 4 ERROR:', err.message);
    }

    // Test 5: Authenticated access to /api/admin/students with Bearer Token
    if (token) {
      totalCount++;
      try {
        const res5 = await makeRequest('/api/admin/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res5.status === 200 && res5.body && res5.body.success) {
          console.log('✅ TEST 5 PASSED: Authenticated access with Bearer token allowed (200 OK)');
          passedCount++;
        } else {
          console.log(`❌ TEST 5 FAILED: Expected 200 but got ${res5.status}`, res5.body);
        }
      } catch (err) {
        console.log('❌ TEST 5 ERROR:', err.message);
      }
    }

    console.log('\n==================================================');
    console.log(` RESULTS: ${passedCount} / ${totalCount} TESTS PASSED`);
    console.log('==================================================');

    server.close();
  });
}

runSecurityTests();
