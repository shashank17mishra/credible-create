import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/admin/users - List all users (SUPER_ADMIN ONLY)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        canManagePosts: true,
        canManageCertificates: true,
        canManagePayments: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/admin/users - Register a new administrator (SUPER_ADMIN ONLY)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, canManagePosts, canManageCertificates, canManagePayments } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email address is already registered" }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role, // SUPER_ADMIN, SUB_ADMIN, STUDENT
        canManagePosts: canManagePosts !== undefined ? canManagePosts : true,
        canManageCertificates: canManageCertificates !== undefined ? canManageCertificates : true,
        canManagePayments: canManagePayments !== undefined ? canManagePayments : false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        canManagePosts: true,
        canManageCertificates: true,
        canManagePayments: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 211 });
  } catch (error) {
    console.error("Admin Users POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
