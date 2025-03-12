import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { UpdateCompanyDto, CompanyResponseDto } from "@/types/dto/company.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
      include: {
        profilePicture: true,
        user: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }

    // Conversion en ResponseDto
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
      } : null
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company = await prisma.company.delete({
      where: {
        id: id,
      },
    });
    if (!company) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }
    
    // Conversion en ResponseDto
    const responseDto: CompanyResponseDto = {
      id: company.id,
      name: company.name,
      description: company.description,
      userId: company.userId,
      profilePictureId: company.profilePictureId,
      createdAt: company.createdAt,
      modifiedAt: company.modifiedAt
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  // Lire les données brutes une seule fois
  const rawData = await req.json();
  // Typer ensuite en tant que DTO
  const data = {
    id,
    ...rawData
  } as UpdateCompanyDto;

  if (!data.name && !data.description && !data.profilePictureId) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    const company = await prisma.company.update({
      where: {
        id: id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.profilePictureId !== undefined && {
          profilePicture: data.profilePictureId ? { connect: { id: data.profilePictureId } } : { disconnect: true }
        }),
      },
      include: {
        profilePicture: true,
        user: true,
      },
    });
    
    // Conversion en ResponseDto
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
      } : null
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
