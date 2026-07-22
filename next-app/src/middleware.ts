import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Only SUPER_ADMIN can access user management UI
    if (path.startsWith("/admin/users") && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin?error=unauthorized", req.url));
    }

    // Only SUPER_ADMIN can access user management API
    if (path.startsWith("/api/admin/users") && token?.role !== "SUPER_ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden - Super Admin access required" }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }

    // Sub-Admin module permission checks
    if (token?.role !== "SUPER_ADMIN") {
      // Blog Posts access validation
      if (path.startsWith("/admin/posts") && token?.canManagePosts === false) {
        return NextResponse.redirect(new URL("/admin?error=forbidden", req.url));
      }
      if (path.startsWith("/api/admin/posts") && token?.canManagePosts === false) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden - Blog Posts management access disabled" }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }

      // Certificates access validation
      if (path.startsWith("/admin/certificates") && token?.canManageCertificates === false) {
        return NextResponse.redirect(new URL("/admin?error=forbidden", req.url));
      }
      if (path.startsWith("/api/admin/certificates") && token?.canManageCertificates === false) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden - Certificates management access disabled" }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }

      // Payments access validation
      if (path.startsWith("/admin/payments") && token?.canManagePayments === false) {
        return NextResponse.redirect(new URL("/admin?error=forbidden", req.url));
      }
      if (path.startsWith("/api/admin/payments") && token?.canManagePayments === false) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden - Payments review access disabled" }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow SUPER_ADMIN or SUB_ADMIN roles in the admin panel
        return token?.role === "SUPER_ADMIN" || token?.role === "SUB_ADMIN";
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
