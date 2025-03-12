import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CompanyResponseDto, CreateCompanyDto, CompanySearchDto } from "@/types/dto/company.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const queryParam = searchParams.get("query");

    // Construction du DTO de recherche
    const searchDto: CompanySearchDto = {
      query: queryParam || undefined
    };

    // Construction des conditions de recherche pour Prisma
    const where: Prisma.CompanyWhereInput = {};

    if (searchDto.query) {
      where.OR = [
        { name: { contains: searchDto.query, mode: 'insensitive' } },
        { description: { contains: searchDto.query, mode: 'insensitive' } }
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        profilePicture: true,
        user: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Conversion en CompanyResponseDto
    const responseDto: CompanyResponseDto[] = companies.map(company => ({
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
      } : undefined
    }));

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entreprises" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data = rawData as CreateCompanyDto;

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

    // Créer d'abord l'entreprise sans la photo de profil
    const companyData: Prisma.CompanyCreateInput = {
      name: data.name,
      description: data.description,
      user: {
        connect: {
          id: data.userId
        }
      }
    };

    try {
      // Créer l'entreprise
      const company = await prisma.company.create({
        data: companyData,
        include: {
          user: true,
          profilePicture: true
        }
      });

      // Si une photo de profil est fournie, la créer et mettre à jour l'entreprise
      if (data.profilePictureId) {
        // Mettre à jour l'entreprise avec la photo de profil
        const updatedCompany = await prisma.company.update({
          where: {
            id: company.id
          },
          data: {
            profilePictureId: data.profilePictureId
          },
          include: {
            user: true,
            profilePicture: true
          }
        });

        // Conversion en DTO de réponse
        const responseDto: CompanyResponseDto = {
          id: updatedCompany.id,
          name: updatedCompany.name,
          description: updatedCompany.description,
          userId: updatedCompany.userId,
          profilePictureId: updatedCompany.profilePictureId,
          createdAt: updatedCompany.createdAt,
          modifiedAt: updatedCompany.modifiedAt,
          user: updatedCompany.user ? {
            id: updatedCompany.user.id,
            email: updatedCompany.user.email,
            name: updatedCompany.user.name
          } : undefined,
          profilePicture: updatedCompany.profilePicture ? {
            id: updatedCompany.profilePicture.id,
            url: updatedCompany.profilePicture.url
          } : undefined
        };

        return NextResponse.json(responseDto, { status: 201 });
      }

      // Conversion en DTO de réponse
      const responseDto: CompanyResponseDto = {
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
        } : undefined
      };

      return NextResponse.json(responseDto, { status: 201 });
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'entreprise:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de l'entreprise" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}
