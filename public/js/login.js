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

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = '/admin/index.html';
      } else {
        errorBox.textContent = `[ ERROR // ${(data.error || 'Invalid email or password.').toUpperCase()} ]`;
        errorBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Authenticate';
      }
    } catch (err) {
      console.error("Login error:", err);
      errorBox.textContent = '[ ERROR // UNEXPECTED SYSTEM ERROR ]';
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Authenticate';
    }
  });
});
