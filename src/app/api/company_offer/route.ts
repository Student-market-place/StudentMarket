import { PrismaClient, EnumStatusTYpe, OfferStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { 
  CompanyOfferResponseDto, 
  CreateCompanyOfferDto, 
  CompanyOfferSearchDto 
} from "@/types/dto/company-offer.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const skillsParams = searchParams.getAll("skills");
    const studentAppliesParams = searchParams.getAll("studentApplies");
    const queryParam = searchParams.get("query");
    const companyIdParam = searchParams.get("companyId");
    const startDateFromParam = searchParams.get("startDateFrom");
    const startDateToParam = searchParams.get("startDateTo");

    // Construction du DTO de recherche
    const searchDto: CompanyOfferSearchDto = {
      type: typeParam as EnumStatusTYpe | undefined,
      status: statusParam as OfferStatus | undefined,
      skills: skillsParams.length > 0 ? skillsParams : undefined,
      query: queryParam || undefined,
      companyId: companyIdParam || undefined,
      startDateFrom: startDateFromParam ? new Date(startDateFromParam) : undefined,
      startDateTo: startDateToParam ? new Date(startDateToParam) : undefined
    };

    // Construction des conditions de recherche pour Prisma
    const where: Prisma.Company_offerWhereInput = {
      deletedAt: null
    };

    if (searchDto.type) {
      where.type = searchDto.type;
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    if (searchDto.companyId) {
      where.companyId = searchDto.companyId;
    }

    if (searchDto.skills && searchDto.skills.length > 0) {
      where.skills = { some: { id: { in: searchDto.skills } } };
    }

    if (studentAppliesParams.length > 0) {
      where.studentApplies = { some: { id: { in: studentAppliesParams } } };
    }

    if (searchDto.query) {
      where.OR = [
        { title: { contains: searchDto.query, mode: 'insensitive' } },
        { description: { contains: searchDto.query, mode: 'insensitive' } },
        { expectedSkills: { contains: searchDto.query, mode: 'insensitive' } }
      ];
    }

    if (searchDto.startDateFrom || searchDto.startDateTo) {
      where.startDate = {};
      if (searchDto.startDateFrom) {
        where.startDate.gte = searchDto.startDateFrom;
      }
      if (searchDto.startDateTo) {
        where.startDate.lte = searchDto.startDateTo;
      }
    }

    const companyOffers = await prisma.company_offer.findMany({
      where,
      include: {
        company: true,
        skills: true,
        studentApplies: {
          where: {
            deletedAt: null
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion en ResponseDto
    const responseDto: CompanyOfferResponseDto[] = companyOffers.map(offer => ({
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

    return NextResponse.json(responseDto, { status: 200 });
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
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data = rawData as CreateCompanyOfferDto;
    
    // Validation des données
    if (!data.companyId || !data.title || !data.description || !data.type || !data.startDate) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }
    
    // Vérifier que l'entreprise existe
    const company = await prisma.company.findUnique({
      where: { id: data.companyId }
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
        title: data.title,
        description: data.description,
        expectedSkills: data.expectedSkills,
        type: data.type,
        startDate: new Date(data.startDate),
        status: data.status || OfferStatus.en_cours,
        company: {
          connect: { id: data.companyId }
        },
        // Connecter les compétences si elles sont fournies
        ...(data.skills && data.skills.length > 0 && {
          skills: {
            connect: data.skills.map((skillId: string) => ({ id: skillId }))
          }
        })
      },
      include: {
        company: true,
        skills: true,
        studentApplies: {
          where: {
            deletedAt: null
          }
        }
      }
    });
    
    // Conversion en ResponseDto
    const responseDto: CompanyOfferResponseDto = {
      id: newOffer.id,
      companyId: newOffer.companyId,
      title: newOffer.title,
      description: newOffer.description,
      expectedSkills: newOffer.expectedSkills,
      startDate: newOffer.startDate,
      type: newOffer.type,
      status: newOffer.status,
      createdAt: newOffer.createdAt,
      modifiedAt: newOffer.modifiedAt,
      deletedAt: newOffer.deletedAt,
      company: newOffer.company ? {
        id: newOffer.company.id,
        name: newOffer.company.name,
        profilePictureId: newOffer.company.profilePictureId
      } : undefined,
      skills: newOffer.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      studentAppliesCount: newOffer.studentApplies.length
    };
    
    return NextResponse.json(responseDto, { status: 201 });
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
