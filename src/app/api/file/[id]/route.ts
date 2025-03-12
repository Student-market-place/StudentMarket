import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  
  try {
    // Récupérer les informations du fichier depuis la base de données
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

    // Rediriger vers l'URL Supabase du fichier
    return NextResponse.redirect(uploadFile.url);
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 