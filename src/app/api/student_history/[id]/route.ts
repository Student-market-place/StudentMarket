import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { StudentHistoryResponseDto, UpdateStudentHistoryDto } from "@/types/dto/student-history.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_history = await prisma.student_history.findUnique({
      where: {
        id: id,
      },
      include: {
        student: true,
        company: true
      }
    });

    if (!student_history) {
      return NextResponse.json(
        { error: "Historique non trouvé" },
        { status: 404 }
      );
    }

    // Conversion en ResponseDto
    const responseDto: StudentHistoryResponseDto = {
      id: student_history.id,
      studentId: student_history.studentId,
      companyId: student_history.companyId,
      startDate: student_history.startDate,
      endDate: student_history.endDate,
      createdAt: student_history.createdAt,
      modifiedAt: student_history.modifiedAt,
      deletedAt: student_history.deletedAt,
      student: student_history.student ? {
        id: student_history.student.id,
        firstName: student_history.student.firstName,
        lastName: student_history.student.lastName,
        profilePictureId: student_history.student.profilePictureId
      } : undefined,
      company: student_history.company ? {
        id: student_history.company.id,
        name: student_history.company.name,
        profilePictureId: student_history.company.profilePictureId
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student_history = await prisma.student_history.delete({
      where: {
        id: id,
      },
      include: {
        student: true,
        company: true
      }
    });
    
    if (!student_history) {
      return NextResponse.json(
        { error: "Historique non trouvé" },
        { status: 404 }
      );
    }
    
    // Conversion en ResponseDto
    const responseDto: StudentHistoryResponseDto = {
      id: student_history.id,
      studentId: student_history.studentId,
      companyId: student_history.companyId,
      startDate: student_history.startDate,
      endDate: student_history.endDate,
      createdAt: student_history.createdAt,
      modifiedAt: student_history.modifiedAt,
      deletedAt: student_history.deletedAt,
      student: student_history.student ? {
        id: student_history.student.id,
        firstName: student_history.student.firstName,
        lastName: student_history.student.lastName,
        profilePictureId: student_history.student.profilePictureId
      } : undefined,
      company: student_history.company ? {
        id: student_history.company.id,
        name: student_history.company.name,
        profilePictureId: student_history.company.profilePictureId
      } : undefined
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  
  // Lire les données brutes une seule fois
  const rawData = await req.json();
  // Typer ensuite en tant que DTO
  const data = {
    id,
    ...rawData
  } as UpdateStudentHistoryDto;

  if (!data.startDate && data.endDate === undefined) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    const student_history = await prisma.student_history.update({
      where: {
        id: id,
      },
      data: {
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
      },
      include: {
        student: true,
        company: true
      }
    });

    // Conversion en ResponseDto
    const responseDto: StudentHistoryResponseDto = {
      id: student_history.id,
      studentId: student_history.studentId,
      companyId: student_history.companyId,
      startDate: student_history.startDate,
      endDate: student_history.endDate,
      createdAt: student_history.createdAt,
      modifiedAt: student_history.modifiedAt,
      deletedAt: student_history.deletedAt,
      student: student_history.student ? {
        id: student_history.student.id,
        firstName: student_history.student.firstName,
        lastName: student_history.student.lastName,
        profilePictureId: student_history.student.profilePictureId
      } : undefined,
      company: student_history.company ? {
        id: student_history.company.id,
        name: student_history.company.name,
        profilePictureId: student_history.company.profilePictureId
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
    
