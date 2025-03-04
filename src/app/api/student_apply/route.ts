import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const student_apply = await prisma.student_apply.findMany();
  return NextResponse.json(student_apply, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { studentId, companyOfferId, message } = await req.json();

  if(!studentId || !companyOfferId || !message) {
    return NextResponse.json(
      { error: "studentId, companyOfferId, and message are required" },
      { status: 400 }
    );
  }

  const student_apply = await prisma.student_apply.create({
    data: {
      student: { connect: { id: studentId } },
      companyOffer: { connect: { id: companyOfferId } },
      message,
    },
  });
  return NextResponse.json(student_apply, { status: 201 });
}
