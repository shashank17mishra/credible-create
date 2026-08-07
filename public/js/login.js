document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('login-error');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) return;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Decrypting Credentials...';

      // 1. Try Supabase Auth if client initialized
      if (window.CredibleDB && window.CredibleDB.client) {
        try {
          await window.CredibleDB.signIn(email, password);
          localStorage.setItem('cc_admin_session', JSON.stringify({ email, role: 'admin', time: Date.now() }));
          window.location.href = '/admin/index.html';
          return;
        } catch (sbErr) {
          console.warn("Supabase Auth failed, trying server fallback:", sbErr.message);
        }
      }

      // 2. Try server API login endpoint
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('cc_admin_session', JSON.stringify({ email, role: 'admin', time: Date.now() }));
          window.location.href = '/admin/index.html';
          return;
        }
      } catch (apiErr) {
        console.warn("API login endpoint unavailable, trying demo fallback.");
      }

      // 3. Fallback demo admin authentication (removed for security, handled by API)
      errorBox.textContent = '[ ERROR // INVALID TERMINAL IDENTIFIER OR SECURITY KEY ]';
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Authenticate';
    } catch (err) {
      console.error("Login error:", err);
      errorBox.textContent = '[ ERROR // UNEXPECTED SYSTEM ERROR ]';
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Authenticate';
    }
  });
});
