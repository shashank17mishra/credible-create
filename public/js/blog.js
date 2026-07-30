let allPosts = [];
let activeCategory = 'ALL';
let searchQuery = '';

function getExcerpt(markdown, length = 140) {
  if (!markdown) return '';
  const plain = markdown.replace(/[#*`>_\[\]]/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > length ? plain.slice(0, length) + '…' : plain;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  let filtered = allPosts;

  if (activeCategory !== 'ALL') {
    const cat = activeCategory.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(cat) || 
      p.content.toLowerCase().includes(cat)
    );
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 5rem 2rem; text-align: center; background-color: #ffffff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 1rem; color: #5a5a5a;">
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #121212;">No Publications Found</h3>
        <p style="font-size: 0.9rem;">Try adjusting your search query or selecting a different category filter.</p>
      </div>
    `;
    return;
  }

  const featuredPost = filtered[0];
  const gridPosts = filtered.slice(1);

  let html = '';

  // Render Featured Post
  if (featuredPost) {
    const bgStyle = featuredPost.coverImage 
      ? `background: url(${featuredPost.coverImage}) center/cover no-repeat;` 
      : `background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);`;

    html += `
      <div style="margin-bottom: 4rem;">
        <a href="/blog-detail.html?slug=${encodeURIComponent(featuredPost.slug)}" style="text-decoration: none; color: inherit;">
          <div class="apple-card-hover" style="background-color: #ffffff; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 1.25rem; overflow: hidden; display: grid; grid-template-columns: 1.2fr 1fr; gap: 0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);">
            <div style="height: 380px; overflow: hidden; position: relative;">
              <div class="card-zoom-img" style="width: 100%; height: 100%; ${bgStyle}"></div>
              <span style="position: absolute; top: 1.5rem; left: 1.5rem; background-color: #121212; color: #ffffff; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.7rem; font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.05em;">
                FEATURED STORY
              </span>
            </div>

            <div style="padding: 3rem; display: flex; flex-direction: column; justify-content: center;">
              <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: #10b981; letter-spacing: 0.08em; margin-bottom: 0.75rem;">
                ARTICLE // RESEARCH
              </span>
              <h2 style="font-size: 1.85rem; font-weight: 800; line-height: 1.25; color: #121212; margin-bottom: 1rem; letter-spacing: -0.02em;">
                ${featuredPost.title}
              </h2>
              <p style="font-size: 0.95rem; line-height: 1.6; color: #5a5a5a; margin-bottom: 2rem;">
                ${getExcerpt(featuredPost.content, 180)}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 1.25rem; margin-top: auto; font-size: 0.8rem; color: #909090; font-family: var(--font-mono);">
                <span>By ${featuredPost.author?.name || 'Author'}</span>
                <span>${formatDate(featuredPost.createdAt)}</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  // Render Grid Posts
  if (gridPosts.length > 0) {
    html += `
      <div>
        <h3 style="font-size: 1rem; font-family: var(--font-mono); font-weight: 700; color: #121212; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2rem;">
          ✦ Latest Publications
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
    `;

    gridPosts.forEach(post => {
      const bgStyle = post.coverImage 
        ? `background: url(${post.coverImage}) center/cover no-repeat;` 
        : `background: linear-gradient(135deg, #1e293b 0%, #334155 100%);`;

      html += `
        <a href="/blog-detail.html?slug=${encodeURIComponent(post.slug)}" style="text-decoration: none; color: inherit;">
          <article class="apple-card-hover" style="background-color: #ffffff; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 1rem; overflow: hidden; height: 100%; display: flex; flex-direction: column; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <div style="height: 200px; overflow: hidden; position: relative;">
              <div class="card-zoom-img" style="width: 100%; height: 100%; ${bgStyle}"></div>
            </div>
            <div style="padding: 1.75rem; flex: 1; display: flex; flex-direction: column;">
              <span style="font-size: 0.7rem; font-family: var(--font-mono); font-weight: 700; color: #5a5a5a; margin-bottom: 0.5rem;">
                PUBLICATION
              </span>
              <h3 style="font-size: 1.25rem; font-weight: 700; line-height: 1.35; color: #121212; margin-bottom: 0.75rem;">
                ${post.title}
              </h3>
              <p style="font-size: 0.875rem; line-height: 1.55; color: #5a5a5a; margin-bottom: 1.5rem;">
                ${getExcerpt(post.content, 110)}
              </p>
              <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #909090; font-family: var(--font-mono); border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;">
                <span>${post.author?.name || 'Credible Create'}</span>
                <span>${formatDate(post.createdAt)}</span>
              </div>
            </div>
          </article>
        </a>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

async function loadBlogPosts() {
  try {
    const res = await fetch('/api/posts');
    if (res.ok) {
      allPosts = await res.json();
      renderPosts();
    }
  } catch (err) {
    console.error("Failed to load blog posts:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();

  // Search input event
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPosts();
    });
  }

  // Category chip filter buttons
  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chipBtns.forEach(b => {
        b.style.backgroundColor = '#ffffff';
        b.style.color = '#5a5a5a';
        b.style.borderColor = 'rgba(0,0,0,0.1)';
      });
      btn.style.backgroundColor = '#121212';
      btn.style.color = '#ffffff';
      btn.style.borderColor = '#121212';
      activeCategory = btn.getAttribute('data-cat');
      renderPosts();
    });
  });

  // Newsletter form
  const newsForm = document.getElementById('newsletter-form');
  const newsWrap = document.getElementById('newsletter-wrap');
  if (newsForm && newsWrap) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsWrap.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: #10b981; background-color: #d1fae5; padding: 1rem 2rem; border-radius: 9999px; display: inline-block;">
          ✓ SUCCESS // YOU ARE NOW SUBSCRIBED TO THE JOURNAL!
        </div>
      `;
    });
  }
});
