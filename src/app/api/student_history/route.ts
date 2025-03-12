import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CreateStudentHistoryDto, StudentHistoryResponseDto, StudentHistorySearchDto } from "@/types/dto/student-history.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");
    const companyIdParam = searchParams.get("companyId");

    // Construction du DTO de recherche
    const searchDto: StudentHistorySearchDto = {
      studentId: studentIdParam || undefined,
      companyId: companyIdParam || undefined
    };

    const where: {
      studentId?: string;
      companyId?: string;
      deletedAt: null;
    } = {
      deletedAt: null
    };

    if (searchDto.studentId) {
      where.studentId = searchDto.studentId;
    }
    if (searchDto.companyId) {
      where.companyId = searchDto.companyId;
    }

    const history = await prisma.student_history.findMany({
      include: {
        company: true,
        student: {
          include: {
            school: true,
            profilePicture: true
          }
        }
      },
      where,
      orderBy: {
        startDate: 'desc'
      }
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: StudentHistoryResponseDto[] = history.map(item => ({
      id: item.id,
      studentId: item.studentId,
      companyId: item.companyId,
      startDate: item.startDate,
      endDate: item.endDate,
      createdAt: item.createdAt,
      modifiedAt: item.modifiedAt,
      deletedAt: item.deletedAt,
      student: item.student ? {
        id: item.student.id,
        firstName: item.student.firstName,
        lastName: item.student.lastName,
        profilePictureId: item.student.profilePictureId
      } : undefined,
      company: item.company ? {
        id: item.company.id,
        name: item.company.name,
        profilePictureId: item.company.profilePictureId
      } : undefined
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des historiques:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des historiques",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Lire les données brutes
    const rawData = await req.json();
    // Typer en tant que DTO
    const data = rawData as CreateStudentHistoryDto;

    if (!data.studentId || !data.companyId || !data.startDate) {
      return NextResponse.json(
        { error: "studentId, companyId et startDate sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: data.studentId }
    });

    if (!student) {
      return NextResponse.json(
        { error: "L'étudiant spécifié n'existe pas" },
        { status: 404 }
      );
    }

    // Vérifier que l'entreprise existe
    const company = await prisma.company.findUnique({
      where: { id: data.companyId }
    });

    if (!company) {
      return NextResponse.json(
        { error: "L'entreprise spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    const student_history = await prisma.student_history.create({
      data: {
        student: { connect: { id: data.studentId } },
        company: { connect: { id: data.companyId } },
        startDate: data.startDate,
        endDate: data.endDate,
      },
      include: {
        company: true,
        student: true
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
    
    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'historique:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
