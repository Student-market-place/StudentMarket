import { IParams } from "@/types/api.type";
import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  console.log(req);
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
    skillIds,
    schoolId,
    CVId,
    profilePictureId,
    email,
  } = await req.json();

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Le prénom et le nom sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    const updateData: Prisma.StudentUpdateInput = {
      firstName,
      lastName,
      description,
    };

    if (typeof isAvailable !== "undefined") {
      updateData.isAvailable = isAvailable;
    }

    if (status) {
      updateData.status = status;
    }

    if (userId) {
      updateData.user = { connect: { id: userId } };
    }

    if (Array.isArray(skillIds)) {
      updateData.skills = { set: skillIds.map((id: string) => ({ id })) };
    }

    if (schoolId) {
      updateData.school = { connect: { id: schoolId } };
    }

    if (CVId) {
      updateData.CV = { connect: { id: CVId } };
    }

    if (profilePictureId) {
      updateData.profilePicture = { connect: { id: profilePictureId } };
    }

    if (email) {
      updateData.user = {
        ...updateData.user,
        update: { email },
      };
    }

    const student = await prisma.student.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
    });

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
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
