import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {

  const student = await prisma.student.findMany();

  return NextResponse.json(student, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, status, description, isAvailable, userId, skillsId, schoolId, CVId, profilePictureId } = await req.json();

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
      status,
      description,
      isAvailable,
      userId,
      skillsId,
      schoolId,
      CVId,
      profilePictureId
    },
  });

  return NextResponse.json(student, { status: 201 });
}



