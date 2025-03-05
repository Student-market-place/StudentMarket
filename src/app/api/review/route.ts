import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const reviews = await prisma.review.findMany();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const {
    studentId,
    companyId,
    rating,
    comment,
  } = await req.json();

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
