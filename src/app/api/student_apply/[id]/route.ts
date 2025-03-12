import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { UpdateStudentApplyDto, StudentApplyResponseDto } from "@/types/dto/student-apply.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_apply = await prisma.student_apply.findUnique({
      where: {
        id: id,
      },
      include: {
        student: true,
        companyOffer: {
          include: {
            company: true
          }
        },
      },
    });

    if (!student_apply) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }

    // Conversion en ResponseDto
    const responseDto: StudentApplyResponseDto = {
      id: student_apply.id,
      studentId: student_apply.studentId,
      companyOfferId: student_apply.companyOfferId,
      message: student_apply.message,
      status: student_apply.status,
      createdAt: student_apply.createdAt,
      modifiedAt: student_apply.modifiedAt,
      deletedAt: student_apply.deletedAt,
      student: student_apply.student ? {
        id: student_apply.student.id,
        firstName: student_apply.student.firstName,
        lastName: student_apply.student.lastName,
        profilePictureId: student_apply.student.profilePictureId
      } : undefined,
      companyOffer: student_apply.companyOffer ? {
        id: student_apply.companyOffer.id,
        title: student_apply.companyOffer.title,
        companyId: student_apply.companyOffer.companyId,
        company: student_apply.companyOffer.company ? {
          id: student_apply.companyOffer.company.id,
          name: student_apply.companyOffer.company.name
        } : undefined
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la candidature:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student_apply = await prisma.student_apply.delete({
      where: {
        id: id,
      },
      include: {
        student: true,
        companyOffer: {
          include: {
            company: true
          }
        },
      },
    });
    
    if (!student_apply) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }
    
    // Conversion en ResponseDto
    const responseDto: StudentApplyResponseDto = {
      id: student_apply.id,
      studentId: student_apply.studentId,
      companyOfferId: student_apply.companyOfferId,
      message: student_apply.message,
      status: student_apply.status,
      createdAt: student_apply.createdAt,
      modifiedAt: student_apply.modifiedAt,
      deletedAt: student_apply.deletedAt,
      student: student_apply.student ? {
        id: student_apply.student.id,
        firstName: student_apply.student.firstName,
        lastName: student_apply.student.lastName,
        profilePictureId: student_apply.student.profilePictureId
      } : undefined,
      companyOffer: student_apply.companyOffer ? {
        id: student_apply.companyOffer.id,
        title: student_apply.companyOffer.title,
        companyId: student_apply.companyOffer.companyId,
        company: student_apply.companyOffer.company ? {
          id: student_apply.companyOffer.company.id,
          name: student_apply.companyOffer.company.name
        } : undefined
      } : undefined
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la candidature:", error);
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
  } as UpdateStudentApplyDto;

  if (!data.message && !data.status) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    const student_apply = await prisma.student_apply.update({
      where: {
        id: id,
      },
      data: {
        ...(data.message && { message: data.message }),
        ...(data.status && { status: data.status }),
      },
      include: {
        student: true,
        companyOffer: {
          include: {
            company: true
          }
        },
      },
    });

    // Conversion en ResponseDto
    const responseDto: StudentApplyResponseDto = {
      id: student_apply.id,
      studentId: student_apply.studentId,
      companyOfferId: student_apply.companyOfferId,
      message: student_apply.message,
      status: student_apply.status,
      createdAt: student_apply.createdAt,
      modifiedAt: student_apply.modifiedAt,
      deletedAt: student_apply.deletedAt,
      student: student_apply.student ? {
        id: student_apply.student.id,
        firstName: student_apply.student.firstName,
        lastName: student_apply.student.lastName,
        profilePictureId: student_apply.student.profilePictureId
      } : undefined,
      companyOffer: student_apply.companyOffer ? {
        id: student_apply.companyOffer.id,
        title: student_apply.companyOffer.title,
        companyId: student_apply.companyOffer.companyId,
        company: student_apply.companyOffer.company ? {
          id: student_apply.companyOffer.company.id,
          name: student_apply.companyOffer.company.name
        } : undefined
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la candidature:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
