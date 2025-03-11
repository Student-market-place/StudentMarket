import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const school = await prisma.school.findUnique({
      where: {
        id: id,
      },
    });

    if (!school) {
      return NextResponse.json({ error: "school not found" }, { status: 404 });
    }

    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const school = await prisma.school.delete({
      where: {
        id: id,
      },
    });
    if (!school) {
      return NextResponse.json({ error: "school not found" }, { status: 404 });
    }
    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const { name, domainName, isActive, profilePictureId, email } =
    await req.json();

  if (!name || !domainName) {
    return NextResponse.json(
      { error: "name and domainName are required" },
      { status: 400 }
    );
  }

  try {
    const school = await prisma.school.update({
      where: {
        id: id,
      },
      data: {
        name,
        domainName,
        ...(typeof isActive !== "undefined" && { isActive }),
        ...(profilePictureId && {
          profilePicture: { connect: { id: profilePictureId } },
        }),
        ...(email && {
          user: {
            update: {
              email,
            },
          },
        }),
      },
      include: {
        user: true,
        profilePicture: true,
      },
    });

    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
