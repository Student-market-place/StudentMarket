import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import UploadService from "@/services/upload.service";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Vérifier si la requête est un multipart/form-data
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "La requête doit être de type multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      );
    }

    // Déterminer le type de dossier selon le type de fichier
    const folder = file.type.startsWith("image/") ? "profile-pictures" : "cv";
    
    // Utiliser le service d'upload pour télécharger vers Supabase
    const { url } = await UploadService.uploadFile(file, folder);
    
    // Enregistrer l'URL du fichier dans la base de données
    const uploadFile = await prisma.uploadFile.create({
      data: {
        url: url,
      },
    });

    return NextResponse.json({
      fileId: uploadFile.id,
      url: url,
      message: "Fichier téléchargé avec succès"
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du téléchargement" },
      { status: 500 }
    );
  }
} 