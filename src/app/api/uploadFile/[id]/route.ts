import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const uploadFile = await prisma.uploadFile.findUnique({
      where: {
        id: id,
      },
    });

    if (!uploadFile) {
      return NextResponse.json(
        { error: "uploadFile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(uploadFile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json(
      { error: "url is required" },
      { status: 400 }
    );
  }

  try {
    const uploadFile = await prisma.uploadFile.update({
      where: {
        id: id,
      },
      data: {
        url,
      },
    });

    return NextResponse.json(uploadFile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    await prisma.uploadFile.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "uploadFile deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

