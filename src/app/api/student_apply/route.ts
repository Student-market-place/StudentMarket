import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const student_apply = await prisma.student_apply.findMany();
  return NextResponse.json(student_apply, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { studentId, companyOfferId, message } = await req.json();

  const student_apply = await prisma.student_apply.create({
    data: {
      studentId,
      companyOfferId,
      message,
    },
  });
  return NextResponse.json(student_apply, { status: 201 });
}
