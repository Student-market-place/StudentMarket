import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des compétences" },
      { status: 500 }
    );
  }
} 