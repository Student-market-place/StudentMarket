import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { UpdateSchoolDto, SchoolResponseDto } from "@/types/dto/school.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const school = await prisma.school.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        profilePicture: true,
        students: true
      }
    });

    if (!school) {
      return NextResponse.json({ error: "École non trouvée" }, { status: 404 });
    }

    // Conversion en ResponseDto
    const responseDto: SchoolResponseDto = {
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school.students.length
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'école:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const school = await prisma.school.delete({
      where: {
        id: id,
      },
      include: {
        user: true,
        profilePicture: true,
        students: true
      }
    });
    
    if (!school) {
      return NextResponse.json({ error: "École non trouvée" }, { status: 404 });
    }
    
    // Conversion en ResponseDto
    const responseDto: SchoolResponseDto = {
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school.students.length
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'école:", error);
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
  } as UpdateSchoolDto;

  if (!data.name && !data.domainName && !data.isActive && !data.profilePictureId) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    const school = await prisma.school.update({
      where: {
        id: id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.domainName && { domainName: data.domainName }),
        ...(typeof data.isActive !== "undefined" && { isActive: data.isActive }),
        ...(data.profilePictureId && {
          profilePicture: { connect: { id: data.profilePictureId } },
        }),
      },
      include: {
        user: true,
        profilePicture: true,
        students: true
      },
    });
    
    // Conversion en ResponseDto
    const responseDto: SchoolResponseDto = {
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school.students.length
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'école:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
