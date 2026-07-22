import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const credentialCode = code.trim().toUpperCase()

    const certificate = await prisma.certificate.findUnique({
      where: { credentialCode },
    })

    if (!certificate || !certificate.published) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("Verification API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
