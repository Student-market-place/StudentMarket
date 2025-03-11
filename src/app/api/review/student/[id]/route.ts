import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        studentId: id,
      },
      include: {
        company: true,
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis de l'étudiant" },
      { status: 500 }
    );
  }
}
