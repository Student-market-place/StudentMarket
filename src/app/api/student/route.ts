import { PrismaClient, Prisma } from "@prisma/client";
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
    const data = await req.json();

    if (!data.userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Convertir le status en français pour correspondre à l'enum
    const statusMapping = {
      internship: "stage",
      apprenticeship: "alternance"
    } as const;

    const status = statusMapping[data.status as keyof typeof statusMapping];
    if (!status) {
      return NextResponse.json(
        { error: "Status invalide. Doit être 'internship' ou 'apprenticeship'" },
        { status: 400 }
      );
    }

    // Vérifier et formater les skills
    const skillIds = Array.isArray(data.skills) ? data.skills : [];

    // Créer d'abord l'étudiant
    const studentData: Prisma.StudentCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      status: status,
      isAvailable: data.isAvailable,
      description: data.description,
      user: {
        connect: {
          id: data.userId
        }
      },
      school: {
        connect: {
          id: data.schoolId
        }
      }
    };

    // Ajouter les skills seulement s'il y en a
    if (skillIds.length > 0) {
      studentData.skills = {
        connect: skillIds.map((id: string) => ({ id }))
      };
    }

    const student = await prisma.student.create({
      data: studentData,
      include: {
        skills: true,
        user: true,
        school: true
      }
    });

    // Mettre à jour l'étudiant avec les fichiers si nécessaire
    const updateData: Prisma.StudentUpdateInput = {};

    if (data.CV) {
      const cvUpload = await prisma.uploadFile.create({
        data: { url: data.CV }
      });
      updateData.CV = { connect: { id: cvUpload.id } };
    }

    if (data.profilePicture) {
      const profilePicture = await prisma.uploadFile.create({
        data: { url: data.profilePicture }
      });
      updateData.profilePicture = { connect: { id: profilePicture.id } };
    }

    if (Object.keys(updateData).length > 0) {
      const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: updateData,
        include: {
          skills: true,
          user: true,
          school: true,
          CV: true,
          profilePicture: true
        }
      });
      return NextResponse.json(updatedStudent, { status: 201 });
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'étudiant:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'étudiant" },
      { status: 500 }
    );
  }
}
