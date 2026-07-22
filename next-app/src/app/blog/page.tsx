"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  createdAt: string;
  author?: {
    name: string | null;
  } | null;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          setFilteredPosts(data);
        }
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Filter posts based on category and search query
  useEffect(() => {
    let result = posts;

    if (activeCategory !== "ALL") {
      const cat = activeCategory.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(cat) || 
        p.content.toLowerCase().includes(cat)
      );
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [activeCategory, searchQuery, posts]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail("");
      }, 4000);
    }
  };

  const categories = [
    { label: "ALL ARTICLES", id: "ALL" },
    { label: "ROBOTICS", id: "ROBOTICS" },
    { label: "AI & CYBERNETICS", id: "AI" },
    { label: "DRONE TECH", id: "DRONE" },
    { label: "ANNOUNCEMENTS", id: "ANNOUNCEMENT" },
  ];

  // Helper to extract a short plain text excerpt from markdown
  const getExcerpt = (markdown: string, length = 140) => {
    const plain = markdown
      .replace(/[#*`>_\[\]]/g, "")
      .replace(/\n+/g, " ")
      .trim();
    return plain.length > length ? plain.slice(0, length) + "…" : plain;
  };

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary, #f6f6f6)",
      color: "var(--text-primary, #121212)",
      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    }}>
      {/* Editorial Header Bar */}
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
        zIndex: 100,
      }}>
        <Link href="/" className="logo">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7" />
            <polygon points="2 7 12 12 12 22 2 17" />
            <polygon points="12 12 22 7 22 17 12 22" />
          </svg>
          <span>CREDIBLE // CREATE</span>
        </Link>

        <nav>
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }}>
            <li><Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#5a5a5a", textDecoration: "none" }}>HOME</Link></li>
            <li><Link href="/#courses" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#5a5a5a", textDecoration: "none" }}>COURSES</Link></li>
            <li><Link href="/blog" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#121212", textDecoration: "none", borderBottom: "2px solid #121212", paddingBottom: "4px" }}>BLOG</Link></li>
            <li><Link href="/admin" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#5a5a5a", textDecoration: "none" }}>ADMIN PANEL</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Journal Hero */}
      <main style={{ maxWidth: "1300px", margin: "0 auto", padding: "4rem 2.5rem 6rem 2.5rem" }}>
        
        {/* Chapter Subtitle & Giant Title */}
        <div style={{ marginBottom: "3.5rem" }} className="animate-apple-fade-in">
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#5a5a5a",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ color: "#10b981" }}>✦</span> EDITORIAL & RESEARCH FEEDS
          </div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#121212",
            textTransform: "uppercase",
            marginBottom: "1.25rem"
          }}>
            The Tech & Innovation Journal
          </h1>
          <p style={{
            fontSize: "1.15rem",
            color: "#5a5a5a",
            maxWidth: "680px",
            lineHeight: 1.6
          }}>
            In-depth insights, robotics research papers, AI breakthroughs, and hands-on engineering tutorials curated by Credible Create instructors & researchers.
          </p>
        </div>

        {/* Filter Chips & Realtime Search Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginBottom: "3.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid rgba(0,0,0,0.08)"
        }}>
          {/* Category Chips */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="chip-btn"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  border: "1px solid",
                  borderColor: activeCategory === cat.id ? "#121212" : "rgba(0,0,0,0.1)",
                  backgroundColor: activeCategory === cat.id ? "#121212" : "#ffffff",
                  color: activeCategory === cat.id ? "#ffffff" : "#5a5a5a",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ minWidth: "280px" }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                borderRadius: "9999px",
                border: "1px solid rgba(0,0,0,0.12)",
                backgroundColor: "#ffffff",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                color: "#121212",
                outline: "none"
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "#909090", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            [ INITIALIZING JOURNAL ARCHIVES // LOADING ]
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{
            padding: "5rem 2rem",
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "1rem",
            color: "#5a5a5a"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "#121212" }}>No Publications Found</h3>
            <p style={{ fontSize: "0.9rem" }}>Try adjusting your search query or selecting a different category filter.</p>
          </div>
        ) : (
          <>
            {/* Featured Post Card (Hero Spotlight) */}
            {featuredPost && (
              <div style={{ marginBottom: "4rem" }}>
                <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="apple-card-hover" style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: "0",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)"
                  }}>
                    <div style={{ height: "380px", overflow: "hidden", position: "relative" }}>
                      <div 
                        className="card-zoom-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          background: featuredPost.coverImage 
                            ? `url(${featuredPost.coverImage}) center/cover no-repeat` 
                            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                        }}
                      />
                      <span style={{
                        position: "absolute",
                        top: "1.5rem",
                        left: "1.5rem",
                        backgroundColor: "#121212",
                        color: "#ffffff",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "9999px",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        letterSpacing: "0.05em"
                      }}>
                        FEATURED STORY
                      </span>
                    </div>

                    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        color: "#10b981",
                        letterSpacing: "0.08em",
                        marginBottom: "0.75rem"
                      }}>
                        ARTICLE // RESEARCH
                      </span>

                      <h2 style={{
                        fontSize: "1.85rem",
                        fontWeight: 800,
                        lineHeight: 1.25,
                        color: "#121212",
                        marginBottom: "1rem",
                        letterSpacing: "-0.02em"
                      }}>
                        {featuredPost.title}
                      </h2>

                      <p style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "#5a5a5a",
                        marginBottom: "2rem"
                      }}>
                        {getExcerpt(featuredPost.content, 180)}
                      </p>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        paddingTop: "1.25rem",
                        marginTop: "auto",
                        fontSize: "0.8rem",
                        color: "#909090",
                        fontFamily: "var(--font-mono)"
                      }}>
                        <span>By {featuredPost.author?.name || "Author"}</span>
                        <span>{new Date(featuredPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Remaining Posts Grid (3 Columns) */}
            {gridPosts.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: "1rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "#121212",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "2rem"
                }}>
                  ✦ Latest Publications
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "2rem"
                }}>
                  {gridPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <article className="apple-card-hover" style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "1rem",
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
                      }}>
                        <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                          <div 
                            className="card-zoom-img"
                            style={{
                              width: "100%",
                              height: "100%",
                              background: post.coverImage 
                                ? `url(${post.coverImage}) center/cover no-repeat` 
                                : "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                            }}
                          />
                        </div>

                        <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            color: "#5a5a5a",
                            marginBottom: "0.5rem"
                          }}>
                            PUBLICATION
                          </span>

                          <h3 style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            lineHeight: 1.35,
                            color: "#121212",
                            marginBottom: "0.75rem"
                          }}>
                            {post.title}
                          </h3>

                          <p style={{
                            fontSize: "0.875rem",
                            lineHeight: 1.55,
                            color: "#5a5a5a",
                            marginBottom: "1.5rem"
                          }}>
                            {getExcerpt(post.content, 110)}
                          </p>

                          <div style={{
                            marginTop: "auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "0.75rem",
                            color: "#909090",
                            fontFamily: "var(--font-mono)",
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                            paddingTop: "1rem"
                          }}>
                            <span>{post.author?.name || "Credible Create"}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter & Tech Briefing Subscription Section */}
        <section style={{
          marginTop: "6rem",
          padding: "4rem 3rem",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "1.25rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
        }}>
          <span style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: "#10b981",
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}>
            ✦ BI-WEEKLY BRIEFING
          </span>
          
          <h2 style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#121212",
            marginTop: "0.5rem",
            marginBottom: "0.75rem",
            textTransform: "uppercase"
          }}>
            Stay Ahead in Robotics & AI
          </h2>

          <p style={{
            fontSize: "0.95rem",
            color: "#5a5a5a",
            maxWidth: "540px",
            margin: "0 auto 2rem auto",
            lineHeight: 1.6
          }}>
            Subscribe to receive exclusive engineering tutorials, code repositories, and research updates directly to your inbox.
          </p>

          {subscribed ? (
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#10b981",
              backgroundColor: "#d1fae5",
              padding: "1rem 2rem",
              borderRadius: "9999px",
              display: "inline-block"
            }}>
              ✓ SUCCESS // YOU ARE NOW SUBSCRIBED TO THE JOURNAL!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              maxWidth: "480px",
              margin: "0 auto"
            }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "0.75rem 1.25rem",
                  borderRadius: "2px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  backgroundColor: "#f6f6f6",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  color: "#121212",
                  outline: "none"
                }}
              />
              <button type="submit" className="btn btn-primary">
                <span className="btn-text">SUBSCRIBE NOW</span>
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
