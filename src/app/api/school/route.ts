import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        user: true,
        profilePicture: true,
        students: true,
      },
      where: {
        deletedAt: null,
      },
    });
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, domainName, isActive, profilePictureId, userId } =
      await req.json();

    if (!name || !domainName || !profilePictureId || !userId) {
      return NextResponse.json(
        {
          error: "name, domainName, profilePictureId, and userId are required",
        },
        { status: 400 }
      );
    }

    const school = await prisma.school.create({
      data: {
        name,
        domainName,
        isActive: isActive ?? true,
        profilePicture: { connect: { id: profilePictureId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
        profilePicture: true,
      },
    });
    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
