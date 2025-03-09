import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latest = searchParams.get("latest");
    const email = searchParams.get("email");

    // Recherche par email
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // Récupérer le dernier utilisateur
    if (latest === "true") {
      const latestUser = await prisma.user.findFirst({
        orderBy: {
          createdAt: "desc"
        }
      });

      if (!latestUser) {
        return NextResponse.json(
          { error: "Aucun utilisateur trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json(latestUser);
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role = 'user' } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Créer un nouvel utilisateur
    // Déterminer le rôle à utiliser (assurez-vous qu'il correspond à l'une des valeurs de l'énumération)
    const prismaRole = ['student', 'company', 'admin', 'school'].includes(role) 
      ? role 
      : 'student'; // Valeur par défaut
    
    const newUser = await prisma.user.create({
      data: {
        email,
        role: prismaRole
      }
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 