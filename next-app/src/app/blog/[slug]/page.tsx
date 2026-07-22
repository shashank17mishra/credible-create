import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import type { Metadata } from "next";

interface BlogPostDetailProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0; // Dynamic rendering

export async function generateMetadata({ params }: BlogPostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, content: true },
  });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Credible Create Journal`,
    description: post.content.replace(/[#*`>_\[\]]/g, '').slice(0, 155).trim() + '…',
  };
}

export default async function BlogPostDetail({ params }: BlogPostDetailProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // 404 if post doesn't exist or is not published
  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch 2 other published posts for "Related Articles" footer
  const relatedPosts = await prisma.post.findMany({
    where: { 
      status: "PUBLISHED",
      id: { not: post.id }
    },
    take: 2,
    orderBy: { createdAt: "desc" },
    select: {
      title: true,
      slug: true,
      coverImage: true,
      createdAt: true,
    }
  });

  // Calculate estimated reading time
  const wordCount = post.content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Parse markdown content to html
  const contentHtml = await marked.parse(post.content);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary, #f6f6f6)",
      color: "var(--text-primary, #121212)",
      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
      paddingBottom: "6rem"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 3.5rem",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link href="/" className="logo">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7" />
            <polygon points="2 7 12 12 12 22 2 17" />
            <polygon points="12 12 22 7 22 17 12 22" />
          </svg>
          <span>CREDIBLE // CREATE</span>
        </Link>
        <Link href="/blog" style={{
          color: "#121212",
          textDecoration: "none",
          fontSize: "0.8rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          ← BACK TO JOURNAL
        </Link>
      </header>

      {/* Article Container */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem 0 2rem" }} className="animate-apple-fade-in">
        
        {/* Post Metadata Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1rem",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: "#5a5a5a",
            textTransform: "uppercase"
          }}>
            <span style={{ color: "#10b981" }}>✦ ARTICLE INSIGHTS</span>
            <span>•</span>
            <span>{readTimeMinutes} MIN READ</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#121212",
            marginBottom: "1.75rem",
            letterSpacing: "-0.03em"
          }}>
            {post.title}
          </h1>

          {/* Author & Publication Info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1.25rem",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "0.75rem",
            width: "fit-content"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#121212",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.95rem"
            }}>
              {(post.author?.name || "A")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#121212" }}>
                {post.author?.name || "Credible Create Author"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#909090", fontFamily: "var(--font-mono)" }}>
                Published on {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{
            width: "100%",
            height: "420px",
            background: `url(${post.coverImage}) center/cover no-repeat`,
            borderRadius: "1.25rem",
            marginBottom: "3.5rem",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
          }} />
        )}

        {/* Rendered Body Typography */}
        <article
          className="post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            color: "#334155",
            marginBottom: "4rem"
          }}
        />

        {/* Author Bio Signature Box */}
        <div style={{
          padding: "2rem",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          marginBottom: "5rem"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#121212",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1.25rem",
            flexShrink: 0
          }}>
            {(post.author?.name || "C")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
              WRITTEN BY AUTHOR
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#121212", marginBottom: "0.25rem" }}>
              {post.author?.name || "Credible Create Instructor"}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#5a5a5a", margin: 0 }}>
              Robotics Engineer & Technology Researcher at Credible Create. Specializing in AI systems, embedded cybernetics, and engineering pedagogy.
            </p>
          </div>
        </div>

        {/* Related Articles Footer Grid */}
        {relatedPosts.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.08)", paddingTop: "3rem" }}>
            <h3 style={{
              fontSize: "0.9rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "#121212",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "2rem"
            }}>
              ✦ Continue Reading
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {relatedPosts.map(rel => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="apple-card-hover" style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#909090" }}>
                      {new Date(rel.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#121212", margin: 0, lineHeight: 1.35 }}>
                      {rel.title}
                    </h4>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#121212", marginTop: "auto" }}>
                      Read Story →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
