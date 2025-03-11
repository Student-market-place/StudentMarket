import { Prisma, PrismaClient, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des paramètres de filtrage
    const availability = searchParams.get("availability");
    const contractType = searchParams.get("contractType");
    const skillsParam = searchParams.get("skills");
    const schoolId = searchParams.get("school");

    // Construction de la requête avec les filtres
    const whereClause: Prisma.StudentWhereInput = {
      deletedAt: null,
    };

    // Filtre par disponibilité
    if (availability) {
      whereClause.isAvailable = availability === "true";
    }

    // Filtre par type de contrat
    if (contractType) {
      whereClause.status = contractType as EnumStatusTYpe;
    }

    // Filtre par école
    if (schoolId) {
      whereClause.schoolId = schoolId;
    }

    // Si on filtre par compétences
    if (skillsParam) {
      const skillIds = skillsParam.split(",");

      if (skillIds.length === 1) {
        whereClause.skills = {
          some: {
            id: skillIds[0],
          },
        };
      } else if (skillIds.length > 1) {
        whereClause.AND = skillIds.map((skillId) => ({
          skills: {
            some: {
              id: skillId,
            },
          },
        }));
      }
    }

    const query: Prisma.StudentFindManyArgs = {
      where: whereClause,
      include: {
        user: true,
        skills: true,
        school: true,
        profilePicture: true,
        CV: true,
      },
    };

    // Requête avec toutes les conditions
    const students = await prisma.student.findMany(query);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des étudiants:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des étudiants" },
      { status: 500 }
    );
  }
}
