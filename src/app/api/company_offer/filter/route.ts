import {
  Prisma,
  PrismaClient,
  OfferStatus,
  EnumStatusTYpe,
  Company_offer,
  Company,
  Skill,
  Student_apply,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CompanyOfferSearchDto, CompanyOfferResponseDto } from "@/types/dto/company-offer.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des paramètres de filtrage
    const offerStatus = searchParams.get("status");
    const offerType = searchParams.get("type");
    const skillsParam = searchParams.get("skills");
    const searchQuery = searchParams.get("query");
    const companyId = searchParams.get("companyId");
    const startDateFrom = searchParams.get("startDateFrom");
    const startDateTo = searchParams.get("startDateTo");

    // Construction du DTO de recherche
    const searchDto: CompanyOfferSearchDto = {
      status: offerStatus as OfferStatus || undefined,
      type: offerType as EnumStatusTYpe || undefined,
      skills: skillsParam ? skillsParam.split(",") : undefined,
      query: searchQuery || undefined,
      companyId: companyId || undefined,
      startDateFrom: startDateFrom ? new Date(startDateFrom) : undefined,
      startDateTo: startDateTo ? new Date(startDateTo) : undefined
    };

    // Construction de la requête avec les filtres
    const whereClause: Prisma.Company_offerWhereInput = {
      deletedAt: null,
    };

    // Filtre par statut d'offre
    if (searchDto.status) {
      whereClause.status = searchDto.status;
    }

    // Filtre par type d'offre
    if (searchDto.type) {
      whereClause.type = searchDto.type;
    }
    
    // Filtre par entreprise
    if (searchDto.companyId) {
      whereClause.companyId = searchDto.companyId;
    }
    
    // Filtre par texte de recherche
    if (searchDto.query) {
      whereClause.OR = [
        { title: { contains: searchDto.query, mode: "insensitive" } },
        { description: { contains: searchDto.query, mode: "insensitive" } }
      ];
    }
    
    // Filtre par date de début
    if (searchDto.startDateFrom || searchDto.startDateTo) {
      whereClause.startDate = {};
      
      if (searchDto.startDateFrom) {
        whereClause.startDate.gte = searchDto.startDateFrom;
      }
      
      if (searchDto.startDateTo) {
        whereClause.startDate.lte = searchDto.startDateTo;
      }
    }

    // Si on filtre par compétences
    if (searchDto.skills && searchDto.skills.length > 0) {
      const skillIds = searchDto.skills;

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

    const queryOptions: Prisma.Company_offerFindManyArgs = {
      where: whereClause,
      include: {
        company: true,
        skills: true,
        studentApplies: true,
      },
    };

    // Définition du type pour les résultats inclus
    type CompanyOfferWithRelations = Prisma.Company_offerGetPayload<{
      include: {
        company: true;
        skills: true;
        studentApplies: true;
      }
    }>;

    // Requête avec toutes les conditions
    const offers = await prisma.company_offer.findMany(queryOptions) as CompanyOfferWithRelations[];
    
    // Conversion en tableau de ResponseDto
    const responseDtos: CompanyOfferResponseDto[] = offers.map((offer: CompanyOfferWithRelations) => ({
      id: offer.id,
      companyId: offer.companyId,
      title: offer.title,
      description: offer.description,
      expectedSkills: offer.expectedSkills,
      startDate: offer.startDate,
      type: offer.type,
      status: offer.status,
      createdAt: offer.createdAt,
      modifiedAt: offer.modifiedAt,
      deletedAt: offer.deletedAt,
      company: offer.company ? {
        id: offer.company.id,
        name: offer.company.name,
        profilePictureId: offer.company.profilePictureId
      } : undefined,
      skills: offer.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      studentAppliesCount: offer.studentApplies.length
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des offres:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des offres" },
      { status: 500 }
    );
  }
}
