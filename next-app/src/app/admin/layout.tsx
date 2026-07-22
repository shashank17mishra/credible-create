import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import "./admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Verification step (middleware handles this, but layout adds fallback protection)
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role !== "SUPER_ADMIN" && role !== "SUB_ADMIN") {
    redirect("/");
  }

  return (
    <div className="admin-body">
      <div className="admin-container">
        <AdminSidebar user={session.user} />
        <div className="admin-viewport">
          <header className="admin-header">
            <div className="header-title-sec">
              <h2>System Control Console</h2>
            </div>
            <div className="header-status-badge">
              [ SECURE ACCESS // GRANTED ]
            </div>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
