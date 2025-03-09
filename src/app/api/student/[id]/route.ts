import { IParams } from "@/types/api.type";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  const {
    firstName,
    lastName,
    status,
    description,
    isAvailable,
    userId,
    skillsId,
    schoolId,
    CVId,
    profilePictureId,
  } = await req.json();

  if (
    !firstName ||
    !lastName ||
    !status ||
    !userId ||
    !skillsId ||
    !schoolId ||
    !CVId ||
    !profilePictureId
  ) {
    return NextResponse.json(
      { error: "Veuillez renseigner tous les champs obligatoires" },
      { status: 400 }
    );
  }

  try {
    const student = await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        firstName,
        lastName,
        status,
        description,
        isAvailable,
        user: { connect: { id: userId } },
        skills: { set: skillsId.map((id: string) => ({ id })) },
        school: { connect: { id: schoolId } },
        CV: { connect: { id: CVId } },
        profilePicture: { connect: { id: profilePictureId } },
      },
    });

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student = await prisma.student.delete({
      where: {
        id: id,
      },
    });
    if (!student) {
      return NextResponse.json({ error: "student not found" }, { status: 404 });
    }
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
