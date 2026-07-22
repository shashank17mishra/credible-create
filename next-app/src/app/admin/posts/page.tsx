"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author?: {
    name: string | null;
    email: string;
  };
}

export default function BlogPostsManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userRole, setUserRole] = useState("SUB_ADMIN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch session
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session?.user) {
          setUserRole(session.user.role);
        }

        // Fetch posts
        const postsRes = await fetch("/api/admin/posts");
        if (!postsRes.ok) throw new Error("Failed to load blog posts");
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err: any) {
        setError(err.message || "Error fetching posts");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update post status");
      }

      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      showToast(`Post status updated to ${newStatus.toUpperCase()}`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (userRole !== "SUPER_ADMIN") {
      showToast("Access Denied: Only Super Admins can delete posts", "error");
      return;
    }

    if (!confirm("Are you sure you want to delete this blog post permanently?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete post");
      }

      setPosts(posts.filter(p => p.id !== id));
      showToast("Blog post deleted successfully", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      {toast && (
        <div className={`toast-msg ${toast.type}`}>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            [ {toast.type === "error" ? "FAIL" : toast.type === "success" ? "OK" : "INFO"} // {toast.message.toUpperCase()} ]
          </span>
        </div>
      )}

      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Blog Content Engine</h1>
          <p>Compose, publish, and schedule technological articles</p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Compose Article
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ ACQUIRING POST DATA // LOADING ]</span>
        </div>
      ) : error ? (
        <div className="login-error" style={{ padding: "2rem" }}>
          [ EXCEPTION // {error.toUpperCase()} ]
        </div>
      ) : (
        <div className="glass-panel table-panel" style={{ padding: "1.5rem" }}>
          {posts.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
              No blog posts composed yet. Click "Compose Article" to get started.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 600, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--admin-cyber-cyan)" }}>
                      {post.slug}
                    </td>
                    <td>{post.author?.name || "Unassigned"}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleStatus(post)}
                        style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
                        title="Click to toggle status"
                      >
                        <span className={`status-pill ${post.status === "PUBLISHED" ? "success" : "warning"}`}>
                          {post.status}
                        </span>
                      </button>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link 
                          href={`/admin/posts/${post.id}`} 
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                          disabled={userRole !== "SUPER_ADMIN"}
                          title={userRole !== "SUPER_ADMIN" ? "Delete action restricted to Super Admins" : "Delete permanently"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
