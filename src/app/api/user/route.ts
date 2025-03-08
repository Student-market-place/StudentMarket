import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Récupérer tous les utilisateurs
export async function GET(req: NextRequest) {
  try {
    // Vérifier si on demande le dernier utilisateur
    const { searchParams } = new URL(req.url);
    const getLatest = searchParams.get('latest');

    if (getLatest === 'true') {
      const latestUser = await prisma.user.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestUser) {
        return NextResponse.json({ error: "Aucun utilisateur trouvé" }, { status: 404 });
      }

      return NextResponse.json(latestUser, { status: 200 });
    }

    // Sinon, retourner tous les utilisateurs
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    
    console.log("Creating user with role:", role);

    // Créer un utilisateur temporaire avec le rôle spécifié
    const user = await prisma.user.create({
      data: {
        email: `temp_${Date.now()}@temp.com`, // Email temporaire
        name: "Temporary User"
      },
    });

    console.log("Created temporary user:", user);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


