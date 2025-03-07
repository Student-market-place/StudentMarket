import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const typeParam = searchParams.get("type");

    const where: Prisma.Company_offerWhereInput = {};

    if (typeParam) {
      where.type = typeParam as Prisma.Company_offerWhereInput["type"];
    }

    const companyOffers = await prisma.company_offer.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(companyOffers, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la récupération des offres de l'entreprise" },
      { status: 500 }
    );
  }
}