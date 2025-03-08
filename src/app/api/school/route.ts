import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des écoles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des écoles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, domainName, isActive, profilePictureId, user } = await req.json();

  if(!name || !domainName || !isActive || !profilePictureId) {
    return NextResponse.json(
      { error: "name, domainName, isActive, profilePictureId are required" },
      { status: 400 }
    );
  }

  const school = await prisma.school.create({
    data: {
      user,
      name,
      domainName,
      isActive,
      profilePicture: { connect: { id: profilePictureId }},
    },
  });
  return NextResponse.json(school, { status: 201 });
}
