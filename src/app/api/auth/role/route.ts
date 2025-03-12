import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateRoleDto, RegisterResponseDto } from "@/types/dto/auth.dto";

export async function POST(request: NextRequest) {
  try {
    // Lire les données brutes une seule fois
    const rawData = await request.json();
    // Typer ensuite en tant que DTO
    const data = rawData as UpdateRoleDto;

    if (!data.userId || !data.role) {
      return NextResponse.json(
        { error: "L'identifiant utilisateur et le rôle sont requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role }
    });

    // Conversion en ResponseDto
    const responseDto: RegisterResponseDto = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return NextResponse.json(responseDto);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle:", error);
    return NextResponse.json(
      { error: "Échec de la mise à jour du rôle" },
      { status: 500 }
    );
  }
} 