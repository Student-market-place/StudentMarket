import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const companyOfferIdParam = searchParams.get("companyOfferId");

    const where: {
      companyOffer?: { id: string };
    } = {};

    if (companyOfferIdParam) {
      where.companyOffer = { id: companyOfferIdParam };
    }

    const student_apply = await prisma.student_apply.findMany({
      where,
      include: {
        student: true,
        companyOffer: true,
      },
    });
    return NextResponse.json(student_apply, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des demandes d'étudiant",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, companyOfferId, message, status } = await req.json();

    if (!studentId || !companyOfferId || !message || !status) {
      return NextResponse.json(
        { error: "studentId, companyOfferId, and message are required" },
        { status: 400 }
      );
    }

    const student_apply = await prisma.student_apply.create({
      data: {
        status: "en_attente",
        student: { connect: { id: studentId } },
        companyOffer: { connect: { id: companyOfferId } },
        message,
      },
      include: {
        student: true,
        companyOffer: true,
      },
    });
    return NextResponse.json(student_apply, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la création de la demande d'étudiant",
      },
      { status: 500 }
    );
  }
}
