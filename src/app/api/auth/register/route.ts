import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();
    console.log("📧 API - Tentative d'inscription:", { email, role });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("👤 API - Utilisateur existant");
      return NextResponse.json({ exists: true }, { status: 200 });
    }

    // Créer un nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        role: (role as Role) || "student"
      }
    });

    console.log("✅ API - Nouvel utilisateur créé:", newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("❌ API - Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
} 