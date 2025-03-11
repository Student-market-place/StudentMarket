import { PrismaClient, EnumStatusTYpe, OfferStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const skillsParams = searchParams.getAll("skills");

    const where: {
      type?: EnumStatusTYpe;
      status?: OfferStatus;
      skills?: { some: { id: { in: string[] } } };
    } = {};

    if (typeParam) {
      where.type = typeParam as EnumStatusTYpe;
    }

    if (statusParam) {
      if (Object.values(OfferStatus).includes(statusParam as OfferStatus)) {
        where.status = statusParam as OfferStatus;
      }
    }

    if (skillsParams.length > 0) {
      where.skills = { some: { id: { in: skillsParams } } };
    }

    const companyOffers = await prisma.company_offer.findMany({
      where,
      include: {
        company: true,
        skills: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companyOffers, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des offres de l'entreprise",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extraire les données de l'offre
    const { 
      companyId, 
      title, 
      description, 
      type, 
      startDate,
      expectedSkills = "",
      status,
      skills = []
    } = body;
    
    // Validation des données
    if (!companyId || !title || !description || !type || !startDate) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }
    
    // Vérifier que l'entreprise existe
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "L'entreprise spécifiée n'existe pas" },
        { status: 404 }
      );
    }
    
    // Créer l'offre
    const newOffer = await prisma.company_offer.create({
      data: {
        title,
        description,
        expectedSkills,
        type: type as EnumStatusTYpe,
        startDate: new Date(startDate),
        status: (status as OfferStatus) || OfferStatus.en_cours,
        company: {
          connect: { id: companyId }
        },
        // Connecter les compétences si elles sont fournies
        ...(skills.length > 0 && {
          skills: {
            connect: skills.map((skillId: string) => ({ id: skillId }))
          }
        })
      },
      include: {
        company: true,
        skills: true
      }
    });
    
    return NextResponse.json(newOffer, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'offre:", error);
    
    return NextResponse.json(
      {
        error: (error as Error).message || "Erreur lors de la création de l'offre"
      },
      { status: 500 }
    );
  }
}
