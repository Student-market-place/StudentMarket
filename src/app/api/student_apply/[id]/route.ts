import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_apply = await prisma.student_apply.findUnique({
      where: {
        id: id,
      },
    });

    if (!student_apply) {
      return NextResponse.json(
        { error: "student_apply not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  console.log("DELETE ONE student_apply");
  console.log("DELETE req", req);
  const { id } = await params;

  try {
    const student_apply = await prisma.student_apply.delete({
      where: {
        id: id,
      },
    });
    if (!student_apply) {
      return NextResponse.json(
        { error: "student_apply not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    // Récupérer les nouvelles données du corps de la requête
    const data = await req.json();

    // Vérifier si l'ID est bien présent
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Mettre à jour l'entreprise avec les nouvelles données
    const student_apply = await prisma.student_apply.update({
      where: { id: id },
      data: data, // Passer les nouvelles données
    });

    return NextResponse.json(student_apply, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
