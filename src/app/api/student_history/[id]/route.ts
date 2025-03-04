import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_history = await prisma.student_history.findUnique({
      where: {
        id: id,
      },
    });

    if (!student_history) {
      return NextResponse.json(
        { error: "student_history not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student_history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  console.log("DELETE ONE student_history");
  console.log("DELETE req", req);
  const { id } = await params;

  try {
    const student_history = await prisma.student_history.delete({
      where: {
        id: id,
      },
    });
    if (!student_history) {
      return NextResponse.json(
        { error: "student_history not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(student_history, { status: 200 });
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
    const student_history = await prisma.student_history.update({
      where: { id: id },
      data: data, // Passer les nouvelles données
    });

    return NextResponse.json(student_history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
