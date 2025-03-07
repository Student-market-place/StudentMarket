import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const availableParam = searchParams.get("available");
    const statusParam = searchParams.get("status");
    const skillsParams = searchParams.getAll("skills");

    const where: {
      isAvailable?: boolean;
      status?: string;
      skills?: { some: { id: { in: string[] } } };
    } = {};

    if (availableParam === "true") {
      where.isAvailable = true;
    } else if (availableParam === "false") {
      where.isAvailable = false;
    }

    if (statusParam) {
      where.status = statusParam;
    }

    if (skillsParams.length > 0) {
      where.skills = { some: { id: { in: skillsParams } } };
    }

    const students = await prisma.student.findMany({
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error: unknown) {
    console.log("error", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des étudiants",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        status,
        description,
        isAvailable,
        user: { connect: { id: userId } },
        skills: { connect: skillsId.map((id: string) => ({ id })) },
        school: { connect: { id: schoolId } },
        CV: { connect: { id: CVId } },
        profilePicture: { connect: { id: profilePictureId } },
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la création de l'étudiant",
      },
      { status: 500 }
    );
  }
}
