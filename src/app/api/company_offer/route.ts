import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
try {
    const searchParams = req.nextUrl.searchParams;
    const typeParams = searchParams.get("type");

    const where: { 
      type?: string;
    } = {}; 

    if (typeParams) {
      where.type = typeParams;
    }
    const companyOffer = await prisma.company_offer.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(companyOffer, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la récupération des company offer" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { companyId, title, description, expectedSkills, startDate, type } =
    await req.json();
    
  if (!companyId || !title || !description || !expectedSkills || !startDate || !type) {
    return NextResponse.json(
      { error: "companyId, title, description, expectedSkills, startDate, type are required" },
      { status: 400 }
    );
  }

  const company_offer = await prisma.company_offer.create({
    data: {
      company: { connect: { id: companyId } },
      title,
      description,
      expectedSkills,
      startDate,
      type,
    },
  });
  return NextResponse.json(company_offer, { status: 201 });
}
