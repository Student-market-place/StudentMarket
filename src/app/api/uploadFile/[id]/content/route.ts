import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";

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

    // Récupération de l'URL du fichier
    const fileUrl = uploadFile.url;
    
    // Si l'URL est une URL locale du serveur (commence par /) ou une URL relative
    if (fileUrl.startsWith('/')) {
      // Redirige vers cette URL directement
      return NextResponse.redirect(new URL(fileUrl, req.url));
    }
    
    // Si c'est une URL externe (http:// ou https://)
    try {
      // Vérifier si c'est une URL valide
      new URL(fileUrl);
      
      // Fetch le contenu de l'image
      const fetchResponse = await fetch(fileUrl);
      if (!fetchResponse.ok) {
        throw new Error(`Erreur lors de la récupération du fichier distant: ${fetchResponse.statusText}`);
      }
      
      // Récupérer le type de contenu et le blob
      const contentType = fetchResponse.headers.get('content-type') || 'application/octet-stream';
      const blob = await fetchResponse.blob();
      
      // Renvoyer directement le contenu binaire avec le bon type MIME
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } catch (error) {
      console.error("Erreur URL ou fetch:", error);
      // Renvoyer une réponse d'erreur
      return NextResponse.json({ error: "URL de fichier invalide" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 