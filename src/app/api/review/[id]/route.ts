import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const review = await prisma.review.findUnique({
      where: {
        id: id,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "review not found" }, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const review = await prisma.review.delete({
      where: {
        id: id,
      },
    });
    if (!review) {
      return NextResponse.json({ error: "review not found" }, { status: 404 });
    }
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const { studentId, companyId, rating, comment } = await req.json();

  if (!studentId || !companyId || !rating || !comment) {
    return NextResponse.json(
      { error: "studentId, companyId, rating, comment are required" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.update({
      where: {
        id: id,
      },
      data: {
        student: { connect: { id: studentId } },
        company: { connect: { id: companyId } },
        rating,
        comment,
      },
    });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}