import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ message: "url is required" }, { status: 400 });
  }

  const uploadFile = await prisma.uploadFile.create({
    data: {
      url,
    },
  });

  return NextResponse.json(uploadFile, { status: 201 });
}

export async function GET() {
  const uploadFile = await prisma.uploadFile.findMany();

  return NextResponse.json(uploadFile, { status: 200 });
}
