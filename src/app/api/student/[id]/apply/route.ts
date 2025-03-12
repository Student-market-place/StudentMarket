import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: IParams
): Promise<NextResponse> {
  const { id } = await params;

  console.log(`Fetching student apply applications for student ID: ${id}`);

  try {
    const studentApplies = await prisma.student_apply.findMany({
      where: {
        studentId: id,
      },
      include: {
        student: true,
        companyOffer: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!studentApplies || studentApplies.length === 0) {
      console.warn(`No applications found for student with ID ${id}`);
      return NextResponse.json(
        { error: "No applications found for this student" },
        { status: 404 }
      );
    }

    console.log(
      `Found ${studentApplies.length} applications for student with ID ${id}`
    );
    return NextResponse.json(studentApplies, { status: 200 });
  } catch (error) {
    console.error(`Error fetching applications for student ID ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
