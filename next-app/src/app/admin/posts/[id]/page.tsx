"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Load existing post details
  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) {
          throw new Error("Failed to retrieve post details");
        }
        const post = await res.json();
        setTitle(post.title);
        setSlug(post.slug);
        setCoverImage(post.coverImage || "");
        setContent(post.content);
        setStatus(post.status);
      } catch (err: any) {
        showToast(err.message || "Error loading post", "error");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  // Update markdown HTML preview
  useEffect(() => {
    async function renderMarkdown() {
      if (content) {
        try {
          const parsed = await marked.parse(content);
          setHtmlPreview(parsed);
        } catch (e) {
          console.error("Markdown parse error:", e);
        }
      } else {
        setHtmlPreview("<p style='color:#64748b; font-style:italic;'>Live preview window. Write some markdown content to render.</p>");
      }
    }
    renderMarkdown();
  }, [content]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper function to insert formatted markdown tags at selection ranges (like MS Word / Google Docs)
  const insertFormat = (type: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let cursorOffset = 0;

    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case "underline":
        replacement = `<u>${selectedText || "underlined text"}</u>`;
        cursorOffset = selectedText ? 0 : 4;
        break;
      case "strikethrough":
        replacement = `~~${selectedText || "strikethrough text"}~~`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "h1":
        replacement = `\n# ${selectedText || "Heading 1"}\n`;
        break;
      case "h2":
        replacement = `\n## ${selectedText || "Heading 2"}\n`;
        break;
      case "h3":
        replacement = `\n### ${selectedText || "Heading 3"}\n`;
        break;
      case "ul":
        replacement = `\n- ${selectedText || "list item"}\n`;
        break;
      case "ol":
        replacement = `\n1. ${selectedText || "list item"}\n`;
        break;
      case "quote":
        replacement = `\n> ${selectedText || "blockquote text"}\n`;
        break;
      case "code":
        replacement = `\n\`\`\`javascript\n${selectedText || "// code block here"}\n\`\`\`\n`;
        break;
      case "link":
        const url = prompt("Enter link URL:", "https://");
        if (url === null) return;
        replacement = `[${selectedText || "link text"}](${url})`;
        break;
      case "image":
        const imageUrl = prompt("Enter image URL:", "https://");
        if (imageUrl === null) return;
        replacement = `![${selectedText || "image alt text"}](${imageUrl})`;
        break;
      case "hr":
        replacement = `\n---\n`;
        break;
      case "clear":
        if (confirm("Are you sure you want to clear the entire content?")) {
          setContent("");
          textarea.focus();
          return;
        }
        return;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    // Refocus textarea and place cursor appropriately
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length - cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, coverImage, content, status }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save post");
      }

      showToast("Post updated successfully!", "success");
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      showToast(err.message, "error");
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && (
        <div className={`toast-msg ${toast.type}`}>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            [ {toast.type === "error" ? "FAIL" : "OK"} // {toast.message.toUpperCase()} ]
          </span>
        </div>
      )}

      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Edit Publication</h1>
          <p>Modify existing content properties and state variables</p>
        </div>
        <Link href="/admin/posts" className="admin-btn admin-btn-secondary">
          ← Cancel & Return
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ RETRIEVING PUBLICATION ARCHIVES // LOADING ]</span>
        </div>
      ) : (
        <>
          {/* View Switcher Controls */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`admin-btn ${activeTab === "editor" ? "admin-btn-primary" : "admin-btn-secondary"}`}
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            >
              ✍️ Composition Workspace
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`admin-btn ${activeTab === "preview" ? "admin-btn-primary" : "admin-btn-secondary"}`}
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            >
              👁️ Live Rendering Preview
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Editor Pane - Only shown when activeTab === 'editor' */}
            {activeTab === "editor" && (
              <div className="editor-pane glass-panel" style={{ padding: "2rem" }}>
                <h3 className="form-section-title" style={{ marginTop: 0 }}>
                  <span style={{ color: "var(--admin-cyber-indigo)" }}>✦</span> Composition Workspace
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="title">Post Title *</label>
                  <input
                    type="text"
                    id="title"
                    className="admin-input"
                    placeholder="e.g. Navigating AI Ethics in Drone Systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="slug">Custom URL Slug *</label>
                  <input
                    type="text"
                    id="slug"
                    className="admin-input"
                    placeholder="e.g. ai-ethics-drone-systems"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="coverImage">Cover Image URL</label>
                  <input
                    type="url"
                    id="coverImage"
                    className="admin-input"
                    placeholder="e.g. /assets/class_ai.png or external https URL"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="status">Publish Status</label>
                  <select
                    id="status"
                    className="admin-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="DRAFT">DRAFT (Saved to control panel only)</option>
                    <option value="PUBLISHED">PUBLISHED (Live on public blog feed)</option>
                  </select>
                </div>

                {/* Document Canvas with Formatting Tools */}
                <div className="admin-form-group" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <label className="admin-label" htmlFor="content">Content Canvas (Word/Docs Tools) *</label>
                  
                  <div className="editor-toolbar">
                    <button type="button" onClick={() => insertFormat("bold")} className="toolbar-btn" title="Bold (Ctrl+B)"><b>B</b></button>
                    <button type="button" onClick={() => insertFormat("italic")} className="toolbar-btn" title="Italic (Ctrl+I)"><i>I</i></button>
                    <button type="button" onClick={() => insertFormat("underline")} className="toolbar-btn" title="Underline (Ctrl+U)"><u>U</u></button>
                    <button type="button" onClick={() => insertFormat("strikethrough")} className="toolbar-btn" title="Strikethrough"><s>S</s></button>
                    
                    <div className="toolbar-divider"></div>
                    
                    <button type="button" onClick={() => insertFormat("h1")} className="toolbar-btn" title="Heading 1" style={{ fontSize: "0.75rem" }}>H1</button>
                    <button type="button" onClick={() => insertFormat("h2")} className="toolbar-btn" title="Heading 2" style={{ fontSize: "0.75rem" }}>H2</button>
                    <button type="button" onClick={() => insertFormat("h3")} className="toolbar-btn" title="Heading 3" style={{ fontSize: "0.75rem" }}>H3</button>
                    
                    <div className="toolbar-divider"></div>
                    
                    <button type="button" onClick={() => insertFormat("ul")} className="toolbar-btn" title="Bullet List">• List</button>
                    <button type="button" onClick={() => insertFormat("ol")} className="toolbar-btn" title="Numbered List">1. List</button>
                    <button type="button" onClick={() => insertFormat("quote")} className="toolbar-btn" title="Blockquote">” Block</button>
                    
                    <div className="toolbar-divider"></div>
                    
                    <button type="button" onClick={() => insertFormat("code")} className="toolbar-btn" title="Code Block">&lt;/&gt;</button>
                    <button type="button" onClick={() => insertFormat("link")} className="toolbar-btn" title="Insert Link">🔗 Link</button>
                    <button type="button" onClick={() => insertFormat("image")} className="toolbar-btn" title="Insert Image">🖼️ Image</button>
                    <button type="button" onClick={() => insertFormat("hr")} className="toolbar-btn" title="Horizontal Line">― Line</button>
                    
                    <div className="toolbar-divider" style={{ marginLeft: "auto" }}></div>
                    <button type="button" onClick={() => insertFormat("clear")} className="toolbar-btn" title="Clear Canvas" style={{ color: "#ef4444" }}>🧹 Clear</button>
                  </div>
                  
                  <textarea
                    id="content"
                    className="canvas-sheet"
                    placeholder="Start typing your article here... Highlight text to apply formatting rules."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                  disabled={saving}
                >
                  {saving ? "Saving Changes..." : "Commit Changes"}
                </button>
              </div>
            )}

            {/* Live Preview Pane - Only shown when activeTab === 'preview' */}
            {activeTab === "preview" && (
              <div className="editor-pane glass-panel" style={{ padding: "2.5rem" }}>
                <h3 className="form-section-title" style={{ marginTop: 0 }}>
                  <span style={{ color: "var(--admin-cyber-cyan)" }}>✦</span> Live Rendering Preview
                </h3>

                <div className="preview-pane" style={{ minHeight: "500px" }}>
                  {coverImage && (
                    <div 
                      style={{ 
                        height: "260px", 
                        width: "100%", 
                        borderRadius: "0.5rem", 
                        marginBottom: "1.5rem",
                        background: `url(${coverImage}) center/cover no-repeat` 
                      }}
                    />
                  )}
                  <h1 style={{ marginTop: 0, fontSize: "2rem" }}>{title || "Untitled Article"}</h1>
                  <div 
                    className="markdown-content" 
                    dangerouslySetInnerHTML={{ __html: htmlPreview }} 
                  />
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
