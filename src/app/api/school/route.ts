import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const school = await prisma.school.findUnique({
      where: {
        id: id,
      },
    });

    if (!school) {
      return NextResponse.json({ error: "school not found" }, { status: 404 });
    }

    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, domainName, isActive, profilePictureId } = await req.json();

  if(!name || !domainName || !isActive || !profilePictureId) {
    return NextResponse.json(
      { error: "name, domainName, isActive, profilePictureId are required" },
      { status: 400 }
    );
  }

  const school = await prisma.school.create({
    data: {
      name,
      domainName,
      isActive,
      profilePicture: { connect: { id: profilePictureId }},
    },
  });
  return NextResponse.json(school, { status: 201 });
}
