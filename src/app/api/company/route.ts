import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const company = await prisma.company.findMany();
  return NextResponse.json(company, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { name, profilePictureId, description } = await req.json();

  if (!name || !profilePictureId || !description) {
    return NextResponse.json(
      { error: "name, profilePictureId, description are required" },
      { status: 400 }
    );
  }

  const company = await prisma.company.create({
    data: {
      name,
      profilePicture: { connect: { id: profilePictureId } },
      description,
    },
  });
  return NextResponse.json(company, { status: 201 });
}
