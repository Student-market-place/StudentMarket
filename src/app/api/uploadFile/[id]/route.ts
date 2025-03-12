import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";
import { UploadFileResponseDto, UpdateUploadFileDto } from "@/types/dto/upload-file.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const uploadFile = await prisma.uploadFile.findUnique({
      where: {
        id: id,
      },
    });

    if (!uploadFile) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    // Conversion en ResponseDto
    const responseDto: UploadFileResponseDto = {
      id: uploadFile.id,
      url: uploadFile.url,
      createdAt: uploadFile.createdAt,
      modifiedAt: uploadFile.modifiedAt,
      deletedAt: uploadFile.deletedAt,
      // On pourrait ajouter ici d'autres informations comme le type de fichier basé sur l'extension
      type: uploadFile.url.split('.').pop()?.toLowerCase() || undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier:", error);
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
  } as UpdateUploadFileDto;

  if (!data.url) {
    return NextResponse.json(
      { error: "L'URL est requise" },
      { status: 400 }
    );
  }

  try {
    const uploadFile = await prisma.uploadFile.update({
      where: {
        id: id,
      },
      data: {
        url: data.url,
      },
    });

    // Conversion en ResponseDto
    const responseDto: UploadFileResponseDto = {
      id: uploadFile.id,
      url: uploadFile.url,
      createdAt: uploadFile.createdAt,
      modifiedAt: uploadFile.modifiedAt,
      deletedAt: uploadFile.deletedAt,
      type: uploadFile.url.split('.').pop()?.toLowerCase() || undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du fichier:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const uploadFile = await prisma.uploadFile.delete({
      where: {
        id: id,
      },
    });

    // Conversion en ResponseDto
    const responseDto: UploadFileResponseDto = {
      id: uploadFile.id,
      url: uploadFile.url,
      createdAt: uploadFile.createdAt,
      modifiedAt: uploadFile.modifiedAt,
      deletedAt: uploadFile.deletedAt,
      type: uploadFile.url.split('.').pop()?.toLowerCase() || undefined
    };

    return NextResponse.json(
      { 
        message: "Fichier supprimé avec succès", 
        data: responseDto 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

