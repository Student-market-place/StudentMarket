import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des écoles:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des écoles" },
      { status: 500 }
    );
  }
} 