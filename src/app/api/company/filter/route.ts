import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Récupération des paramètres de filtrage
    const companyName = searchParams.get("name");

    // Construction de la requête avec les filtres
    const filters: any = {
      deletedAt: null,
    };

    // Filtre par nom d'entreprise
    if (companyName) {
      filters.name = {
        contains: companyName,
        mode: 'insensitive' // Recherche insensible à la casse
      };
    }

    // Préparation de la requête de recherche
    const query = {
      where: filters,
      include: {
        user: true,
        profilePicture: true,
        companyOffers: {
          where: {
            deletedAt: null,
          },
          include: {
            skills: true,
          },
        },
      },
    };

    // Exécution de la requête
    const companies = await prisma.company.findMany(query);

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des entreprises:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des entreprises" },
      { status: 500 }
    );
  }
} 