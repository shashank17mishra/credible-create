import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/certificates/[id] - Get details of a single certificate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "SUB_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const cert = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(cert);
  } catch (error) {
    console.error("Admin Certificate GET by ID Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/admin/certificates/[id] - Update a certificate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "SUB_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { credentialCode, recipientName, courseTitle, issueDate, published } = body;

    const existingCert = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Check unique credentialCode if changed
    if (credentialCode && credentialCode.trim().toUpperCase() !== existingCert.credentialCode) {
      const cleanCode = credentialCode.trim().toUpperCase();
      const codeCheck = await prisma.certificate.findUnique({
        where: { credentialCode: cleanCode }
      });
      if (codeCheck) {
        return NextResponse.json({ error: "Credential Code already in use" }, { status: 400 });
      }
    }

    const updatedCert = await prisma.certificate.update({
      where: { id },
      data: {
        credentialCode: credentialCode ? credentialCode.trim().toUpperCase() : existingCert.credentialCode,
        recipientName: recipientName || existingCert.recipientName,
        courseTitle: courseTitle || existingCert.courseTitle,
        issueDate: issueDate ? new Date(issueDate) : existingCert.issueDate,
        published: published !== undefined ? published : existingCert.published,
      },
    });

    return NextResponse.json(updatedCert);
  } catch (error) {
    console.error("Admin Certificate PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/certificates/[id] - Delete a certificate (SUPER_ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Role-based deletion check
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only Super Admins can delete certificates" }, { status: 403 });
    }

    const { id } = await params;

    const existingCert = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Admin Certificate DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
