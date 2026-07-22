"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    canManagePosts?: boolean;
    canManageCertificates?: boolean;
    canManagePayments?: boolean;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Dashboard Overview", path: "/admin", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    )}
  ];

  // Dynamically push items based on Super Admin role or specific permission flags
  if (user.role === "SUPER_ADMIN" || user.canManagePosts !== false) {
    navItems.push({ name: "Blog Posts", path: "/admin/posts", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )});
  }

  if (user.role === "SUPER_ADMIN" || user.canManageCertificates !== false) {
    navItems.push({ name: "Certificates", path: "/admin/certificates", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 11 11 13 15 9" />
      </svg>
    )});
  }

  if (user.role === "SUPER_ADMIN" || user.canManagePayments !== false) {
    navItems.push({ name: "Payments Log", path: "/admin/payments", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )});
  }

  // Super Admin only tab
  if (user.role === "SUPER_ADMIN") {
    navItems.push({
      name: "Users & Admins",
      path: "/admin/users",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    });
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/" className="sidebar-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>ADMIN // CREATE</span>
      </Link>

      <ul className="sidebar-menu">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
          return (
            <li key={item.path} className={`sidebar-item ${isActive ? "active" : ""}`}>
              <Link href={item.path}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="profile-avatar">
            {(user.name || user.email || "A").substring(0, 1).toUpperCase()}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user.name || "Administrator"}</div>
            <div className="profile-role">{user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Terminal Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
