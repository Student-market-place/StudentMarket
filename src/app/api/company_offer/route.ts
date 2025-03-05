import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const company_offer = await prisma.company_offer.findMany();
  return NextResponse.json(company_offer, { status: 200 });
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
