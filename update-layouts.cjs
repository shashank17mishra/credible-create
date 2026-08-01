const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const globalFloatingActions = `
  <div class="floating-contact-actions" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 1rem;">
    <!-- WhatsApp -->
    <a href="https://wa.me/919999999999" target="_blank" class="floating-action-btn whatsapp-btn" style="width: 44px; height: 44px; border-radius: 50%; background-color: #111; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); text-decoration: none; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
    <!-- Call -->
    <a href="tel:+919999999999" class="floating-action-btn call-btn" style="width: 44px; height: 44px; border-radius: 50%; background-color: #111; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); text-decoration: none; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </a>
  </div>
`;

const globalHeader = `  <header>
    <a href="/index.html" class="logo" id="logo-link" style="display: flex; align-items: center; gap: 0.35rem; text-decoration: none;">
      <img src="/assets/logo.png" alt="Credible Create Logo" style="height: 70px; width: auto;" />
      <span style="font-family: 'Asimovian', sans-serif; font-size: 1.0rem; letter-spacing: 1px; line-height: 1.1; display: flex; flex-direction: column;">
        <span>CREDIBLE</span>
        <span>CREATE</span>
      </span>
    </a>
    <nav>
      <ul>
        <li><a href="/index.html" class="nav-link">Home</a></li>
        <li><a href="/programs.html" class="nav-link">Programs</a></li>
        <li><a href="/about.html" class="nav-link">About</a></li>
        <li><a href="/projects.html" class="nav-link">FAQ</a></li>
        <li><a href="/verify.html" class="nav-link">Verify Portal</a></li>
        <li><a href="/blog.html" class="nav-link">Blog</a></li>
        <li><a href="/login.html" class="nav-link">Login</a></li>
        <li><a href="/demo.html" class="btn btn-primary" style="padding: 0.45rem 1.25rem; font-size: 0.65rem;"><span class="btn-text">Join</span></a></li>
      </ul>
    </nav>
  </header>`;

const globalFooter = `  <footer style="background-color: var(--bg-primary, #f6f6f6); border-top: 1px solid rgba(0, 0, 0, 0.06); padding: 5rem 3.5rem 3rem; position: relative; z-index: 10; width: 100%; margin-top: auto;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2.5rem;">
      <div class="footer-brand-row" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
        <a href="/index.html" class="logo" style="display: flex; align-items: center; gap: 0.35rem; text-decoration: none;">
          <img src="/assets/logo.png" alt="Credible Create Logo" style="height: 70px; width: auto;" />
          <span style="font-family: 'Asimovian', sans-serif; font-size: 1.0rem; letter-spacing: 1px; line-height: 1.1; display: flex; flex-direction: column; text-align: left; color: #121212;">
            <span>CREDIBLE</span>
            <span>CREATE</span>
          </span>
        </a>
        <nav class="footer-top-nav">
          <ul style="display: flex; list-style: none; gap: 2rem; align-items: center; flex-wrap: wrap; margin: 0; padding: 0;">
            <li><a href="/programs.html" style="text-decoration: none; color: #5a5a5a; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Programs</a></li>
            <li><a href="/about.html" style="text-decoration: none; color: #5a5a5a; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">About</a></li>
            <li><a href="/projects.html" style="text-decoration: none; color: #5a5a5a; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Projects</a></li>
            <li><a href="/verify.html" style="text-decoration: none; color: #5a5a5a; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Verify</a></li>
            <li><a href="/demo.html" class="btn btn-primary" style="padding: 0.45rem 1.25rem; font-size: 0.65rem; background: #111; color: #fff; text-decoration: none; border-radius: 4px;"><span class="btn-text">Join</span></a></li>
          </ul>
        </nav>
      </div>

      <div class="footer-section-divider" style="height: 1px; background-color: rgba(0, 0, 0, 0.06); width: 100%;"></div>

      <div class="footer-columns-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; width: 100%;">
        <div class="footer-col">
          <h4 style="font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #121212; margin-bottom: 1.25rem;">Credible Create</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0;">
            <li><a href="/about.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Our Mission</a></li>
            <li><a href="/about.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Our Team</a></li>
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">Careers (We're Hiring)</a></li>
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">Partnerships</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #121212; margin-bottom: 1.25rem;">Bot Barracks</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0;">
            <li><a href="/programs.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Robotics Labs</a></li>
            <li><a href="/programs.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Innovation Design</a></li>
            <li><a href="/projects.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Student Cohorts</a></li>
            <li><a href="/verify.html" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem;">Verify Portal</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #121212; margin-bottom: 1.25rem;">Resources</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0;">
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">Figma Mockups</a></li>
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">Onshape Tutorials</a></li>
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">NotebookLM Prompts</a></li>
            <li><a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.9rem; pointer-events: none; opacity: 0.4;">Curriculum PDFs</a></li>
          </ul>
        </div>
        <div class="footer-col footer-cta-col">
          <h4 style="font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #121212; margin-bottom: 1.25rem;">Connect</h4>
          <p style="color: #5a5a5a; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.25rem;">Have a school or program in mind? Let's build something meaningful.</p>
          <a href="/demo.html" class="btn btn-primary footer-cta-btn" style="display: inline-block; padding: 0.6rem 1.25rem; background: #111; color: #fff; text-decoration: none; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1.25rem;">
            <span class="btn-text">Request a Call →</span>
          </a>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <a href="mailto:info@crediblecreate.com" style="text-decoration: none; color: #121212; font-size: 0.85rem;">info@crediblecreate.com</a>
            <a href="#" style="text-decoration: none; color: #5a5a5a; font-size: 0.85rem; pointer-events: none; opacity: 0.4;">Community Forum</a>
          </div>
        </div>
      </div>

      <div class="footer-section-divider" style="height: 1px; background-color: rgba(0, 0, 0, 0.06); width: 100%;"></div>

      <div class="footer-bottom-row" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-family: var(--font-mono, monospace); font-size: 0.75rem; color: #909090;">
        <span>© 2026 Credible Create. All rights reserved.</span>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #10b981; display: inline-block;"></span>
          <span style="color: #909090;">SYS.STATUS // LIVE</span>
        </div>
        <div style="display: flex; gap: 1.5rem;">
          <a href="#" style="text-decoration: none; color: #909090; pointer-events: none; opacity: 0.4;">Privacy Policy</a>
          <a href="#" style="text-decoration: none; color: #909090; pointer-events: none; opacity: 0.4;">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>`;

const indexFooterLogoMarkup = `          <a href="/index.html" class="logo footer-logo" id="footer-logo-link" style="display: flex; align-items: center; gap: 0.35rem; text-decoration: none;">
            <img src="/assets/logo.png" alt="Credible Create Logo" style="height: 70px; width: auto;" />
            <span style="font-family: 'Asimovian', sans-serif; font-size: 1.0rem; letter-spacing: 1px; line-height: 1.1; display: flex; flex-direction: column; text-align: left; color: #121212;">
              <span>CREDIBLE</span>
              <span>CREATE</span>
            </span>
          </a>`;

const adminHeader = `      <header class="admin-header">
        <div class="header-title-sec" style="display: flex; align-items: center; gap: 1rem;">
          <button id="admin-mobile-menu-btn" class="admin-mobile-toggle" aria-label="Toggle Navigation Sidebar" style="display: none; background: transparent; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.5rem; cursor: pointer; color: #0f172a;">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h2>Control Center</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <span class="header-status-badge">SYS.STATUS // LIVE</span>
          <a href="/index.html" target="_blank" class="btn-view-site" style="font-size: 0.75rem; text-decoration: none; color: #0f172a; border: 1px solid #cbd5e1; padding: 0.45rem 0.85rem; border-radius: 6px; font-weight: 600; background: #fff; display: flex; align-items: center; gap: 0.35rem;">
            <span>View Website</span>
            <span>↗</span>
          </a>
        </div>
      </header>`;

const loginLogoMarkup = `    <a href="/index.html" class="login-logo" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; margin-bottom: 2rem;">
      <img src="/assets/logo.png" alt="Credible Create Logo" style="height: 54px; width: auto;" />
      <span style="font-family: 'Asimovian', sans-serif; font-size: 1.0rem; letter-spacing: 1px; line-height: 1.1; display: flex; flex-direction: column; color: #0f172a; text-align: left;">
        <span>CREDIBLE</span>
        <span>CREATE</span>
      </span>
    </a>`;

for (const file of files) {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (file === 'login.html') {
    // For login.html: remove any public header or footer and update login logo
    content = content.replace(/<header\s[^>]*>[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header>[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<footer\s[^>]*>[\s\S]*?<\/footer>/gi, '');
    content = content.replace(/<footer>[\s\S]*?<\/footer>/gi, '');

    if (content.includes('class="login-logo"')) {
      content = content.replace(/<a\s[^>]*class="login-logo"[^>]*>[\s\S]*?<\/a>/i, loginLogoMarkup);
    }
  } else if (file.startsWith('admin')) {
    // For admin pages: remove public footer completely, and use sleek Admin Header
    content = content.replace(/<footer\s[^>]*>[\s\S]*?<\/footer>/gi, '');
    content = content.replace(/<footer>[\s\S]*?<\/footer>/gi, '');

    if (content.includes('<header>') && content.includes('</header>')) {
      content = content.replace(/<header>[\s\S]*?<\/header>/i, adminHeader);
    } else if (content.includes('<header ') && content.includes('</header>')) {
      content = content.replace(/<header\s[^>]*>[\s\S]*?<\/header>/i, adminHeader);
    }
  } else {
    // For public pages (index.html, blog.html, blog-detail.html)
    // Replace Header
    if (content.includes('<header>') && content.includes('</header>')) {
      content = content.replace(/<header>[\s\S]*?<\/header>/i, globalHeader);
    } else if (content.includes('<header ') && content.includes('</header>')) {
      content = content.replace(/<header\s[^>]*>[\s\S]*?<\/header>/i, globalHeader);
    } else {
      content = content.replace(/<body[^>]*>/i, match => match + '\n' + globalHeader);
    }

    // Handle Footer
    if (file === 'index.html' || file === 'programs.html') {
      content = content.replace(/<footer\s[^>]*>[\s\S]*?<\/footer>/gi, '');
      content = content.replace(/<footer>[\s\S]*?<\/footer>/gi, '');

      if (content.includes('id="footer-logo-link"')) {
        content = content.replace(/<a\s[^>]*id="footer-logo-link"[^>]*>[\s\S]*?<\/a>/i, indexFooterLogoMarkup);
      }
    } else {
      if (content.includes('<footer>') && content.includes('</footer>')) {
        content = content.replace(/<footer>[\s\S]*?<\/footer>/i, globalFooter);
      } else if (content.includes('<footer ') && content.includes('</footer>')) {
        content = content.replace(/<footer\s[^>]*>[\s\S]*?<\/footer>/i, globalFooter);
      } else {
        if (content.includes('</body>')) {
          content = content.replace('</body>', globalFooter + '\n</body>');
        }
      }
    }
  }

  // Inject floating actions before </body>
  if (!file.startsWith('admin') && !file.includes('login.html')) {
    if (content.includes('floating-contact-actions')) {
      content = content.replace(/<div class="floating-contact-actions"[\s\S]*?<\/div>\s*<\/body>/i, globalFloatingActions + '\n</body>');
    } else {
      content = content.replace(/<\/body>/i, globalFloatingActions + '\n</body>');
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}
