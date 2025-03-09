import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_apply = await prisma.student_apply.findUnique({
      where: {
        id: id,
      },
      include: {
        student: true,
        companyOffer: true,
      },
    });

    if (!student_apply) {
      return NextResponse.json(
        { error: "student_apply not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student_apply = await prisma.student_apply.delete({
      where: {
        id: id,
      },
    });
    if (!student_apply) {
      return NextResponse.json(
        { error: "student_apply not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const {       
    studentId,
    companyOfferId,
    message,
  } = await req.json();

  if (!studentId || !companyOfferId || !message) {
    return NextResponse.json(
      { error: "Veuillez renseigner tous les champs obligatoires" },
      { status: 400 }
    );
  }

  try {
    const student_apply = await prisma.student_apply.update({
      where: {
        id: id,
      },
      data: {
        student: {
          connect: { id: studentId }},
          companyOffer: {
          connect: { id: companyOfferId }},
          message,
          
      },
    });

    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
