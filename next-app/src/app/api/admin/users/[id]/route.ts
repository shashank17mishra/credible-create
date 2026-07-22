import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// PUT /api/admin/users/[id] - Update user (SUPER_ADMIN ONLY)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role, canManagePosts, canManageCertificates, canManagePayments } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check unique email if email changed
    if (email && email !== existingUser.email) {
      const emailCheck = await prisma.user.findUnique({
        where: { email }
      });
      if (emailCheck) {
        return NextResponse.json({ error: "Email address already registered" }, { status: 400 });
      }
    }

    const updateData: any = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      role: role || existingUser.role,
      canManagePosts: canManagePosts !== undefined ? canManagePosts : existingUser.canManagePosts,
      canManageCertificates: canManageCertificates !== undefined ? canManageCertificates : existingUser.canManageCertificates,
      canManagePayments: canManagePayments !== undefined ? canManagePayments : existingUser.canManagePayments,
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        canManagePosts: true,
        canManageCertificates: true,
        canManagePayments: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Admin User PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user (SUPER_ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    // Self-deletion check
    if (id === session.user.id) {
      return NextResponse.json({ error: "Self-deletion error. You cannot delete your own profile." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin User DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
