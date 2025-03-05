import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "company not found" }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company = await prisma.company.delete({
      where: {
        id: id,
      },
    });
    if (!company) {
      return NextResponse.json({ error: "company not found" }, { status: 404 });
    }
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const { name, profilePictureId, description } = await req.json();

  if (!name || !profilePictureId || !description) {
    return NextResponse.json(
      { error: "name, profilePictureId, description are required" },
      { status: 400 }
    );
  }

  try {
    const company = await prisma.company.update({
      where: {
        id: id,
      },
      data: {
        name,
        profilePicture: { connect: { id: profilePictureId } },
        description,
      },
    });
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}