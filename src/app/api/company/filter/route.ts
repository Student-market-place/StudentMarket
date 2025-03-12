import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CompanySearchDto, CompanyResponseDto } from "@/types/dto/company.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des paramètres de filtrage
    const companyName = searchParams.get("name");
    
    // Construction du DTO de recherche
    const searchDto: CompanySearchDto = {
      query: companyName || undefined
    };

    // Construction de la requête avec les filtres
    const filters: Prisma.CompanyWhereInput = {
      deletedAt: null,
    };

    // Filtre par nom d'entreprise
    if (searchDto.query) {
      filters.name = {
        contains: searchDto.query,
        mode: "insensitive", // Recherche insensible à la casse
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

    // Conversion en tableau de ResponseDto
    const responseDtos: CompanyResponseDto[] = companies.map(company => ({
      id: company.id,
      name: company.name,
      description: company.description,
      userId: company.userId,
      profilePictureId: company.profilePictureId,
      createdAt: company.createdAt,
      modifiedAt: company.modifiedAt,
      user: company.user ? {
        id: company.user.id,
        email: company.user.email,
        name: company.user.name
      } : undefined,
      profilePicture: company.profilePicture ? {
        id: company.profilePicture.id,
        url: company.profilePicture.url
      } : null
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des entreprises:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des entreprises" },
      { status: 500 }
    );
  }
}
