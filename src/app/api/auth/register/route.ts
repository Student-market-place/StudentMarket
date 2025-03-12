import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RegisterUserDto, RegisterResponseDto } from "@/types/dto/auth.dto";

export async function POST(req: NextRequest) {
  try {
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data = rawData as RegisterUserDto;

    if (!data.email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      const responseDto: RegisterResponseDto = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        exists: true
      };
      return NextResponse.json(responseDto, { status: 200 });
    }

    // Créer un nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        role: data.role || "student"
      }
    });

    // Conversion en ResponseDto
    const responseDto: RegisterResponseDto = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };

    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("❌ API - Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
} 