import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const student_history = await prisma.student_history.findMany();
  return NextResponse.json(student_history, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { studentId, companyId, startDate, endDate } = await req.json();

  if (!studentId || !companyId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "studentId, companyId, startDate, and endDate are required" },
      { status: 400 }
    );
  }

  const student_history = await prisma.student_history.create({
    data: {
      student: { connect: { id: studentId } },
      company: { connect: { id: companyId } },
      startDate,
      endDate,
    },
  });
  return NextResponse.json(student_history, { status: 201 });
}
