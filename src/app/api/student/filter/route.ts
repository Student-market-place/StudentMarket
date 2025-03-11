import { PrismaClient } from "@prisma/client";
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
    const filters: any = {
      deletedAt: null,
    };

    // Filtre par disponibilité
    if (availability) {
      filters.isAvailable = availability === "true";
    }

    // Filtre par type de contrat
    if (contractType) {
      filters.status = contractType;
    }

    // Filtre par école
    if (schoolId) {
      filters.schoolId = schoolId;
    }

    // Préparation de la requête de recherche
    let query: any = {
      where: filters,
      include: {
        user: true,
        skills: true,
        school: true,
        profilePicture: true,
        CV: true,
      },
    };

    // Si on filtre par compétences, utilisons la relation directe dans la requête
    if (skillsParam) {
      const skillIds = skillsParam.split(',');
      
      if (skillIds.length === 1) {
        // Pour une seule compétence
        query.where.skills = {
          some: {
            id: skillIds[0]
          }
        };
      } else if (skillIds.length > 1) {
        // Pour plusieurs compétences, on utilise AND pour chaque compétence
        query.where.AND = skillIds.map(skillId => ({
          skills: {
            some: {
              id: skillId
            }
          }
        }));
      }
    }

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