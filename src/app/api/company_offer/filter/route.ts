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
    const whereClause: Prisma.Company_offerWhereInput = {
      deletedAt: null,
    };

    // Filtre par statut d'offre
    if (offerStatus) {
      whereClause.status = offerStatus as OfferStatus;
    }

    // Filtre par type d'offre
    if (offerType) {
      whereClause.type = offerType as EnumStatusTYpe;
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

    const query: Prisma.Company_offerFindManyArgs = {
      where: whereClause,
      include: {
        company: true,
        skills: true,
        studentApplies: true,
      },
    };

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
