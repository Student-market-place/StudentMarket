import {
  Prisma,
  PrismaClient,
  OfferStatus,
  EnumStatusTYpe,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des paramètres de filtrage
    const offerStatus = searchParams.get("status");
    const offerType = searchParams.get("type");
    const skillsParam = searchParams.get("skills");

    // Construction de la requête avec les filtres
    const filters: Prisma.Company_offerWhereInput = {
      deletedAt: null,
    };

    // Filtre par statut d'offre
    if (offerStatus) {
      filters.status = offerStatus as OfferStatus;
    }

    // Filtre par type d'offre
    if (offerType) {
      filters.type = offerType as EnumStatusTYpe;
    }

    // Si on filtre par compétence, ajoutons-le directement à la requête Prisma
    let query: any = {
      where: filters,
      include: {
        company: true,
        skills: true,
        studentApplies: true,
      },
    };

    // Si on filtre par compétences, utilisons la relation directe dans la requête
    if (skillsParam) {
      const skillIds = skillsParam.split(",");

      if (skillIds.length === 1) {
        // Pour une seule compétence
        query.where.skills = {
          some: {
            id: skillIds[0],
          },
        };
      } else if (skillIds.length > 1) {
        // Pour plusieurs compétences, on utilise AND pour chaque compétence
        query.where.AND = skillIds.map((skillId) => ({
          skills: {
            some: {
              id: skillId,
            },
          },
        }));
      }
    }

    // Requête avec toutes les conditions
    const offers = await prisma.company_offer.findMany(query);

    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des offres:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des offres" },
      { status: 500 }
    );
  }
}
