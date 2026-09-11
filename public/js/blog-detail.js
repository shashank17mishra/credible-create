async function loadArticle() {
  const main = document.getElementById('article-main');
  if (!main) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    main.innerHTML = `
      <div style="text-align: center; padding: 6rem 0; color: #5a5a5a;">
        <h2>Article Not Found</h2>
        <a href="/blog.html">← Return to Blog Journal</a>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }

    const post = await res.json();
    document.title = `${post.title} — Credible Create Journal`;

    const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const contentHtml = window.marked ? window.marked.parse(post.content || '') : post.content;
    const dateFormatted = new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    let coverImageHtml = '';
    if (post.coverImage) {
      coverImageHtml = `
        <div class="blog-detail-cover" style="background: url('${post.coverImage}') center/cover no-repeat;"></div>
      `;
    }

    main.innerHTML = `
      <div style="margin-bottom: 3rem;">
        <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: #5a5a5a; text-transform: uppercase; flex-wrap: wrap;">
          <span style="color: #10b981;">✦ ARTICLE INSIGHTS</span>
          <span>•</span>
          <span>${readTimeMinutes} MIN READ</span>
        </div>

        <h1 style="font-size: clamp(1.85rem, 4.5vw, 3.5rem); font-weight: 800; line-height: 1.15; color: #121212; margin-bottom: 1.75rem; letter-spacing: -0.03em; word-break: break-word;">
          ${post.title}
        </h1>

        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background-color: #ffffff; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 0.75rem; width: fit-content; max-width: 100%;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #121212; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; flex-shrink: 0;">
            ${(post.author?.name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #121212;">
              ${post.author?.name || 'Credible Create Author'}
            </div>
            <div style="font-size: 0.75rem; color: #909090; font-family: var(--font-mono);">
              Published on ${dateFormatted}
            </div>
          </div>
        </div>
      </div>

      ${coverImageHtml}

      <article class="post-content" style="font-size: 1.05rem; line-height: 1.8; color: #334155; margin-bottom: 4rem; word-break: break-word;">
        ${contentHtml}
      </article>

      <div class="blog-author-card">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: #121212; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; flex-shrink: 0;">
          ${(post.author?.name || 'C')[0].toUpperCase()}
        </div>
        <div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: #10b981; text-transform: uppercase;">
            WRITTEN BY AUTHOR
          </div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #121212; margin-bottom: 0.25rem;">
            ${post.author?.name || 'Credible Create Instructor'}
          </div>
          <p style="font-size: 0.85rem; color: #5a5a5a; margin: 0; line-height: 1.6;">
            Robotics Engineer & Technology Researcher at Credible Create. Specializing in AI systems, embedded cybernetics, and engineering pedagogy.
          </p>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Failed to load article:", err);
    main.innerHTML = `
      <div style="text-align: center; padding: 6rem 0; color: #5a5a5a;">
        <h2>Article Not Found</h2>
        <a href="/blog.html">← Return to Blog Journal</a>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);
