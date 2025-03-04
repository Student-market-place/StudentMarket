import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {

  const user = await prisma.user.findMany();

  return NextResponse.json(user, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { name, email, role } = await req.json();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role
    },
  });

  return NextResponse.json(user, { status: 201 });
}


