import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentParam = searchParams.get("student");

    const where: {
      studentId?: string;
    } = {};

    if (studentParam) {
      where.studentId = studentParam;
    }

    const reviews = await prisma.review.findMany({
      include: {
        company: true,
        student: true,
      },
      where,
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error: unknown) {
    console.log("error", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des étudiants",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { studentId, companyId, rating, comment } = await req.json();

  if (!studentId || !companyId || !rating || !comment) {
    return NextResponse.json(
      { error: "studentId, companyId, rating, comment are required" },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      student: { connect: { id: studentId } },
      company: { connect: { id: companyId } },
      rating,
      comment,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
