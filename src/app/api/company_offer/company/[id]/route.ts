import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company_offers = await prisma.company_offer.findMany({
      where: {
        companyId: id,
      },
      include: {
        company: true,
        skills: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(company_offers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis de l'étudiant" },
      { status: 500 }
    );
  }
}
