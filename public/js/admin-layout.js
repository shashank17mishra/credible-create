async function checkAdminSession() {
  try {
    // 1. Check Supabase session if initialized
    if (window.CredibleDB) {
      const sbUser = await window.CredibleDB.getCurrentUser();
      if (sbUser) {
        return {
          name: sbUser.user_metadata?.full_name || sbUser.email,
          email: sbUser.email,
          role: 'SUPER_ADMIN'
        };
      }
    }

    // 2. Check local admin session fallback
    const localSession = localStorage.getItem('cc_admin_session');
    if (localSession) {
      const parsed = JSON.parse(localSession);
      if (parsed && parsed.email) {
        return {
          name: 'Administrator',
          email: parsed.email,
          role: 'SUPER_ADMIN'
        };
      }
    }

    // 3. Fallback check API endpoint
    const res = await fetch('/api/auth/session');
    if (res.ok) {
      const session = await res.json();
      if (session && session.user) return session.user;
    }

    window.location.href = '/admin/login.html';
    return null;
  } catch (err) {
    console.warn("Session check fallback:", err);
    const localSession = localStorage.getItem('cc_admin_session');
    if (localSession) {
      const parsed = JSON.parse(localSession);
      return { name: 'Administrator', email: parsed.email, role: 'SUPER_ADMIN' };
    }
    window.location.href = '/admin/login.html';
    return null;
  }
}

function renderAdminSidebar(user, currentPath) {
  const sidebarContainer = document.getElementById('admin-sidebar-wrap');
  if (!sidebarContainer) return;

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/index.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>` }
  ];

  if (isSuperAdmin || user.canManagePosts !== false) {
    navItems.push({ name: 'Blog Posts', path: '/admin/posts.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` });
  }

  if (isSuperAdmin || user.canManageCertificates !== false) {
    navItems.push({ name: 'Certificates', path: '/admin/certificates.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>` });
  }

  if (isSuperAdmin || user.canManagePayments !== false) {
    navItems.push({ name: 'Payments Log', path: '/admin/payments.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` });
  }

  if (isSuperAdmin) {
    navItems.push({ name: 'Users & Admins', path: '/admin/users.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` });
  }

  let menuHtml = '';
  navItems.forEach(item => {
    const isActive = currentPath === item.path || (item.path !== '/admin/index.html' && currentPath.startsWith(item.path.replace('.html', '')));
    menuHtml += `
      <li class="sidebar-item ${isActive ? 'active' : ''}">
        <a href="${item.path}">
          ${item.icon}
          <span>${item.name}</span>
        </a>
      </li>
    `;
  });

  const avatarInitial = (user.name || user.email || 'A').substring(0, 1).toUpperCase();

  sidebarContainer.innerHTML = `
    <div id="admin-sidebar-backdrop" class="sidebar-backdrop"></div>
    <aside class="admin-sidebar" id="admin-sidebar-el">
      <a href="/index.html" class="sidebar-logo" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;">
        <span style="font-family: 'Asimovian', sans-serif; font-size: 0.95rem; letter-spacing: 1px; line-height: 1.1; display: flex; flex-direction: column; color: #0f172a;">
          <span>CREDIBLE</span>
          <span>CREATE</span>
        </span>
      </a>

      <ul class="sidebar-menu">
        ${menuHtml}
      </ul>

      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="profile-avatar">${avatarInitial}</div>
          <div class="profile-info">
            <div class="profile-name">${user.name || 'Administrator'}</div>
            <div class="profile-role">${user.role}</div>
          </div>
        </div>
        <button id="logout-btn" class="btn-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Terminal Disconnect</span>
        </button>
      </div>
    </aside>
  `;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      localStorage.removeItem('cc_admin_session');
      if (window.CredibleDB) {
        await window.CredibleDB.signOut();
      } else {
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        window.location.href = '/admin/login.html';
      }
    });
  }

  // Setup Mobile Hamburger Menu Toggle
  const toggleBtn = document.getElementById('admin-mobile-menu-btn');
  const sidebarEl = document.getElementById('admin-sidebar-el');
  const backdropEl = document.getElementById('admin-sidebar-backdrop');

  if (toggleBtn && sidebarEl && backdropEl) {
    toggleBtn.addEventListener('click', () => {
      sidebarEl.classList.toggle('open');
      backdropEl.classList.toggle('active');
    });

    backdropEl.addEventListener('click', () => {
      sidebarEl.classList.remove('open');
      backdropEl.classList.remove('active');
    });
  }
}

async function initAdminPage(onUserLoaded) {
  const user = await checkAdminSession();
  if (user) {
    renderAdminSidebar(user, window.location.pathname);
    if (onUserLoaded) onUserLoaded(user);
  }
}
