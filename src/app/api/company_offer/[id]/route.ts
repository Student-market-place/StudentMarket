import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const company_offer = await prisma.company_offer.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
        skills: true,
      }
    });

    if (!company_offer) {
      return NextResponse.json(
        { error: "company_offer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(company_offer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company_offer = await prisma.company_offer.delete({
      where: {
        id: id,
      },
    });
    if (!company_offer) {
      return NextResponse.json(
        { error: "company_offer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(company_offer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const { companyId, title, description, expectedSkills, startDate, type } =
    await req.json();

  if (!companyId || !title || !description || !expectedSkills || !startDate || !type) {
    return NextResponse.json(
      { error: "companyId, title, description, expectedSkills, startDate, type are required" },
      { status: 400 }
    );
  }

  try {
    const company_offer = await prisma.company_offer.update({
      where: {
        id: id,
      },
      data: {
        company: { connect: { id: companyId } },
        title,
        description,
        expectedSkills,
        startDate,
        type,
      },
    });
    return NextResponse.json(company_offer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
