import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateUploadFileDto, UploadFileResponseDto } from "@/types/dto/upload-file.dto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Lire les données brutes
    const rawData = await req.json();
    // Typer en tant que DTO
    const data = rawData as CreateUploadFileDto;

    if (!data.url) {
      return NextResponse.json(
        { error: "L'URL est requise" }, 
        { status: 400 }
      );
    }

    const uploadFile = await prisma.uploadFile.create({
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

    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du fichier:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const uploadFiles = await prisma.uploadFile.findMany({
      where: {
        deletedAt: null
      }
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: UploadFileResponseDto[] = uploadFiles.map(file => ({
      id: file.id,
      url: file.url,
      createdAt: file.createdAt,
      modifiedAt: file.modifiedAt,
      deletedAt: file.deletedAt,
      type: file.url.split('.').pop()?.toLowerCase() || undefined
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
