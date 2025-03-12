import { IParams } from "@/types/api.type";
import { PrismaClient, Prisma, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface StudentUpdateData extends Omit<Prisma.StudentUpdateInput, "status"> {
  firstName: string;
  lastName: string;
  status: EnumStatusTYpe;
  description: string;
  isAvailable: boolean;
  user: { connect: { id: string } };
  skills?: { set: { id: string }[] };
  school: { connect: { id: string } };
  CV?: { connect: { id: string } };
  profilePicture?: { connect: { id: string } };
}

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

  if (!firstName || !lastName || !status || !userId || !schoolId) {
    return NextResponse.json(
      { error: "Le prénom et le nom sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    const updateData: StudentUpdateData = {
      firstName,
      lastName,
      status:
        status === "internship"
          ? EnumStatusTYpe.stage
          : EnumStatusTYpe.alternance,
      description,
      isAvailable,
      user: { connect: { id: userId } },
      school: { connect: { id: schoolId } },
    };

    // Only add skills if skillsId is provided and is an array
    if (Array.isArray(skillIds)) {
      updateData.skills = { set: skillIds.map((id: string) => ({ id })) };
    }

    if (CVId) {
      updateData.CV = { connect: { id: CVId } };
    }

    if (profilePictureId) {
      updateData.profilePicture = { connect: { id: profilePictureId } };
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
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json({ error: error }, { status: 500 });
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
