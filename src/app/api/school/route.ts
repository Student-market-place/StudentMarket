import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const schools = await prisma.school.findMany(); 
    return NextResponse.json(schools);
}



export async function POST(req: NextRequest) {
  const { name, domainName, isActive, profilePictureId } = await req.json();

  if(!name || !domainName || !isActive || !profilePictureId) {
    return NextResponse.json(
      { error: "name, domainName, isActive, profilePictureId are required" },
      { status: 400 }
    );
  }

  const school = await prisma.school.create({
    data: {
      name,
      domainName,
      isActive,
      profilePicture: { connect: { id: profilePictureId }},
    },
  });
  return NextResponse.json(school, { status: 201 });
}
