import { PrismaClient, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const skillsParams = searchParams.getAll("skills");

    const where: {
      type?: EnumStatusTYpe;
      status?: string;
      skills?: { some: { id: { in: string[] } } };
    } = {};

    if (typeParam) {
      where.type = typeParam as EnumStatusTYpe;
    }

    if (statusParam) {
      where.status = statusParam;
    }

    if (skillsParams.length > 0) {
      where.skills = { some: { id: { in: skillsParams } } };
    }

    const companyOffers = await prisma.company_offer.findMany({
      where,
      include: {
        company: true,
        skills: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companyOffers, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des offres de l'entreprise",
      },
      { status: 500 }
    );
  }
}
