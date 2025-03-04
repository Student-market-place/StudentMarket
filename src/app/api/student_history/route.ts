import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const student_history = await prisma.student_history.findMany();
  return NextResponse.json(student_history, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { studentId, companyId, startDate, endDate } = await req.json();

  const student_history = await prisma.student_history.create({
    data: {
      studentId,
      companyId,
      startDate,
      endDate,
    },
  });
  return NextResponse.json(student_history, { status: 201 });
}
