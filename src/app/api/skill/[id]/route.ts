import { IParams } from "@/types/api.type";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const skill = await prisma.skill.findUnique({
      where: {
        id: id,
      },
    });

    if (!skill) {
      return NextResponse.json(
        { error: "skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  const { name } = await req.json();

  try {
    const skill = await prisma.skill.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const skill = await prisma.skill.delete({
      where: {
        id: id,
      },
    });
    if (!skill) {
      return NextResponse.json(
        { error: "skill not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
