import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");

    console.log("studentIdParam", studentIdParam);

    const where: {
      studentId?: string;
    } = {};

    if (studentIdParam) {
      where.studentId = studentIdParam;
    }

    const history = await prisma.student_history.findMany({
      include: {
        company: true,
        student: true,
      },
      where,
    });

    return NextResponse.json(history, { status: 200 });
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
