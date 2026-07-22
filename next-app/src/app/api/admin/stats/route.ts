import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "SUB_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const postsCount = await prisma.post.count();
    const certificatesCount = await prisma.certificate.count();
    const paymentsCount = await prisma.payment.count();
    
    // Sum payment amount
    const payments = await prisma.payment.findMany({
      where: { status: "SUCCESS" },
      select: { amount: true }
    });
    const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);

    const usersCount = await prisma.user.count();

    // Get recent activity log (combine recent posts and certificates)
    const recentPosts = await prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, status: true }
    });

    const recentCerts = await prisma.certificate.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, recipientName: true, createdAt: true, credentialCode: true }
    });

    const recentLogs = [
      ...recentPosts.map(p => ({
        id: p.id,
        type: "POST",
        description: `Blog post "${p.title}" ${p.status === "PUBLISHED" ? "published" : "drafted"}`,
        time: p.createdAt
      })),
      ...recentCerts.map(c => ({
        id: c.id,
        type: "CERTIFICATE",
        description: `Certificate ${c.credentialCode} issued to ${c.recipientName}`,
        time: c.createdAt
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

    return NextResponse.json({
      postsCount,
      certificatesCount,
      paymentsCount,
      paymentsTotal,
      usersCount,
      recentLogs
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
