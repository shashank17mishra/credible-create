import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/certificates - Fetch all certificates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "SUB_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Admin Certificates GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/admin/certificates - Issue a new certificate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "SUB_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { credentialCode, recipientName, courseTitle, issueDate, published } = body;

    if (!credentialCode || !recipientName || !courseTitle || !issueDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const cleanCode = credentialCode.trim().toUpperCase();

    // Check unique credentialCode
    const existingCert = await prisma.certificate.findUnique({
      where: { credentialCode: cleanCode },
    });

    if (existingCert) {
      return NextResponse.json({ error: "Credential Code already in use" }, { status: 400 });
    }

    const newCert = await prisma.certificate.create({
      data: {
        credentialCode: cleanCode,
        recipientName,
        courseTitle,
        issueDate: new Date(issueDate),
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(newCert, { status: 211 });
  } catch (error) {
    console.error("Admin Certificates POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
