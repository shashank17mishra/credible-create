"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  canManagePosts: boolean;
  canManageCertificates: boolean;
  canManagePayments: boolean;
  createdAt: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Modal display states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Add Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SUB_ADMIN");
  const [canManagePosts, setCanManagePosts] = useState(true);
  const [canManageCertificates, setCanManageCertificates] = useState(true);
  const [canManagePayments, setCanManagePayments] = useState(false);

  // Edit states (Modal)
  const [editPassword, setEditPassword] = useState("");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch session
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session?.user) {
          setCurrentUserId(session.user.id);
          if (session.user.role !== "SUPER_ADMIN") {
            setError("Access Forbidden - Super Admin credentials required");
            setLoading(false);
            return;
          }
        } else {
          setError("Unauthenticated terminal session");
          setLoading(false);
          return;
        }

        // Fetch users
        const usersRes = await fetch("/api/admin/users");
        if (!usersRes.ok) throw new Error("Failed to load user credentials");
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading user files");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      showToast("All fields are required", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          canManagePosts,
          canManageCertificates,
          canManagePayments,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to register user");
      }

      const newUser = await res.json();
      setUsers([newUser, ...users]);
      showToast(`User ${newUser.email} registered successfully!`, "success");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("SUB_ADMIN");
      setCanManagePosts(true);
      setCanManageCertificates(true);
      setCanManagePayments(false);
      setIsAddingUser(false); // Close modal
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        canManagePosts: editingUser.canManagePosts,
        canManageCertificates: editingUser.canManageCertificates,
        canManagePayments: editingUser.canManagePayments,
        ...(editPassword.trim() !== "" ? { password: editPassword } : {}),
      };

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user parameters");
      }

      const updated = await res.json();
      setUsers(users.map(u => u.id === updated.id ? { ...u, ...updated } : u));
      setEditingUser(null);
      setEditPassword("");
      showToast(`User credentials updated`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    }
  };

  const handleDeleteUser = async (id: string, emailStr: string) => {
    if (id === currentUserId) {
      showToast("Access Denied: You cannot delete your own credentials", "error");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete administrative credentials for ${emailStr}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user credentials");
      }

      setUsers(users.filter(u => u.id !== id));
      showToast("Credentials deleted successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ SECURING TERMINAL REGISTRY // LOADING ]</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-error" style={{ padding: "2rem", margin: "2rem auto", maxWidth: "600px" }}>
        [ ERROR // {error.toUpperCase()} ]
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div className={`toast-msg ${toast.type}`}>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {`[ ${toast.type === "error" ? "FAIL" : "OK"} // ${toast.message.toUpperCase()} ]`}
          </span>
        </div>
      )}

      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Identity & Access Control</h1>
          <p>Register operators, set clearance options, and manage dashboard permissions</p>
        </div>
        <button 
          onClick={() => setIsAddingUser(true)} 
          className="admin-btn admin-btn-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Administrator
        </button>
      </div>

      {/* Full Width Table Panel */}
      <div className="glass-panel table-panel" style={{ padding: "1.5rem" }}>
        <h3 className="form-section-title" style={{ marginTop: 0, paddingLeft: "0.5rem" }}>
          <span style={{ color: "var(--admin-cyber-cyan)" }}>✦</span> Authorized Operator Logs
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Terminal ID (Email)</th>
              <th>Clearance (Role)</th>
              <th>Access Modules</th>
              <th>Registered Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name || "Anonymous"}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--admin-cyber-cyan)" }}>
                  {user.email}
                </td>
                <td>
                  <span className={`status-pill ${
                    user.role === "SUPER_ADMIN" ? "success" : 
                    user.role === "SUB_ADMIN" ? "info" : "danger"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: "0.75rem" }}>
                  {user.role === "SUPER_ADMIN" ? (
                    <span className="status-pill success" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem" }}>ALL ACCESS</span>
                  ) : user.role === "STUDENT" ? (
                    <span className="status-pill danger" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem" }}>BLOCKED</span>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {user.canManagePosts && <span style={{ color: "#065f46" }}>✓ Posts Workspace</span>}
                      {user.canManageCertificates && <span style={{ color: "#065f46" }}>✓ Certificates</span>}
                      {user.canManagePayments && <span style={{ color: "#065f46" }}>✓ Payments Ledger</span>}
                      {!user.canManagePosts && !user.canManageCertificates && !user.canManagePayments && <span style={{ color: "#991b1b" }}>No active modules</span>}
                    </div>
                  )}
                </td>
                <td style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                      disabled={user.id === currentUserId}
                      title={user.id === currentUserId ? "Self-modification of session disabled" : "Edit credentials"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                      disabled={user.id === currentUserId}
                      title={user.id === currentUserId ? "Self-deletion of session disabled" : "Delete credentials"}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Operator Modal overlay */}
      {isAddingUser && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ background: "#ffffff" }}>
            <h3 className="form-section-title" style={{ marginTop: 0 }}>
              <span style={{ color: "var(--admin-cyber-indigo)" }}>✦</span> Add Credentials
            </h3>
            <form onSubmit={handleRegisterUser}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="username">Full Name *</label>
                <input
                  type="text"
                  id="username"
                  className="admin-input"
                  placeholder="e.g. Shashank Mishra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="useremail">Email Address *</label>
                <input
                  type="email"
                  id="useremail"
                  className="admin-input"
                  placeholder="e.g. shashank@crediblecreate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="userpwd">Security Key (Password) *</label>
                <input
                  type="password"
                  id="userpwd"
                  className="admin-input"
                  placeholder="Password keys must be strong"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="userrole">Security Clearance (Role)</label>
                <select
                  id="userrole"
                  className="admin-select"
                  value={role}
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setRole(selectedRole);
                    // Auto toggle defaults based on role selection
                    if (selectedRole === "SUPER_ADMIN") {
                      setCanManagePosts(true);
                      setCanManageCertificates(true);
                      setCanManagePayments(true);
                    } else if (selectedRole === "STUDENT") {
                      setCanManagePosts(false);
                      setCanManageCertificates(false);
                      setCanManagePayments(false);
                    }
                  }}
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN (Total Access)</option>
                  <option value="SUB_ADMIN">SUB ADMIN (Restricted Editor)</option>
                  <option value="STUDENT">STUDENT (No Console Access)</option>
                </select>
              </div>

              {/* Checkbox Permission Options */}
              <div className="admin-form-group" style={{ marginTop: "1.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <label className="admin-label" style={{ marginBottom: "0.75rem" }}>Clearance Toggles</label>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={canManagePosts}
                      onChange={(e) => setCanManagePosts(e.target.checked)}
                      disabled={role === "SUPER_ADMIN" || role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Blog Posts Workspace</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={canManageCertificates}
                      onChange={(e) => setCanManageCertificates(e.target.checked)}
                      disabled={role === "SUPER_ADMIN" || role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Certificates Registry</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={canManagePayments}
                      onChange={(e) => setCanManagePayments(e.target.checked)}
                      disabled={role === "SUPER_ADMIN" || role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Payments Ledger Review</span>
                  </label>
                </div>
                
                {(role === "SUPER_ADMIN" || role === "STUDENT") && (
                  <p style={{ fontSize: "0.7rem", color: "var(--admin-text-muted)", marginTop: "0.5rem", fontStyle: "italic" }}>
                    * Permissions are locked based on the selected role&apos;s mandatory access requirements.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? "Registering..." : "Publish Credentials"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingUser(false)} 
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Operator Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ background: "#ffffff" }}>
            <h3 className="form-section-title" style={{ marginTop: 0 }}>
              <span style={{ color: "var(--admin-cyber-indigo)" }}>✦</span> Modify Operator Parameters
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="edit-username">Full Name</label>
                <input
                  type="text"
                  id="edit-username"
                  className="admin-input"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="edit-useremail">Email Address</label>
                <input
                  type="email"
                  id="edit-useremail"
                  className="admin-input"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="edit-userpwd">Change Security Key (Password)</label>
                <input
                  type="password"
                  id="edit-userpwd"
                  className="admin-input"
                  placeholder="Leave empty to retain existing key"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="edit-userrole">Security Clearance</label>
                <select
                  id="edit-userrole"
                  className="admin-select"
                  value={editingUser.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    let extra = {};
                    if (newRole === "SUPER_ADMIN") {
                      extra = { canManagePosts: true, canManageCertificates: true, canManagePayments: true };
                    } else if (newRole === "STUDENT") {
                      extra = { canManagePosts: false, canManageCertificates: false, canManagePayments: false };
                    }
                    setEditingUser({ ...editingUser, role: newRole, ...extra });
                  }}
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  <option value="SUB_ADMIN">SUB ADMIN</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </div>

              {/* Edit Permissions Checks */}
              <div className="admin-form-group" style={{ marginTop: "1.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <label className="admin-label" style={{ marginBottom: "0.75rem" }}>Clearance Toggles</label>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editingUser.canManagePosts}
                      onChange={(e) => setEditingUser({ ...editingUser, canManagePosts: e.target.checked })}
                      disabled={editingUser.role === "SUPER_ADMIN" || editingUser.role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Blog Posts Workspace</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editingUser.canManageCertificates}
                      onChange={(e) => setEditingUser({ ...editingUser, canManageCertificates: e.target.checked })}
                      disabled={editingUser.role === "SUPER_ADMIN" || editingUser.role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Certificates Registry</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editingUser.canManagePayments}
                      onChange={(e) => setEditingUser({ ...editingUser, canManagePayments: e.target.checked })}
                      disabled={editingUser.role === "SUPER_ADMIN" || editingUser.role === "STUDENT"}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Payments Ledger Review</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                  Commit Parameters
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingUser(null);
                    setEditPassword("");
                  }} 
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
