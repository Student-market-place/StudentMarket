import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {

  const skill = await prisma.skill.findMany();

  return NextResponse.json(skill, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  const skill = await prisma.skill.create({
    data: {
      name
    },
  });

  return NextResponse.json(skill, { status: 201 });
}