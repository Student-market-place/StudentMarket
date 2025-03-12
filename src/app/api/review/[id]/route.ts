import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";
import { UpdateReviewDto, ReviewResponseDto } from "@/types/dto/review.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const review = await prisma.review.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
        student: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
    }

    // Conversion en ResponseDto
    const responseDto: ReviewResponseDto = {
      id: review.id,
      studentId: review.studentId,
      companyId: review.companyId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      modifiedAt: review.modifiedAt,
      deletedAt: review.deletedAt,
      student: review.student ? {
        id: review.student.id,
        firstName: review.student.firstName,
        lastName: review.student.lastName,
        profilePictureId: review.student.profilePictureId
      } : undefined,
      company: review.company ? {
        id: review.company.id,
        name: review.company.name,
        profilePictureId: review.company.profilePictureId
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'avis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const review = await prisma.review.delete({
      where: {
        id: id,
      },
      include: {
        company: true,
        student: true,
      },
    });
    
    if (!review) {
      return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
    }
    
    // Conversion en ResponseDto
    const responseDto: ReviewResponseDto = {
      id: review.id,
      studentId: review.studentId,
      companyId: review.companyId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      modifiedAt: review.modifiedAt,
      deletedAt: review.deletedAt,
      student: review.student ? {
        id: review.student.id,
        firstName: review.student.firstName,
        lastName: review.student.lastName,
        profilePictureId: review.student.profilePictureId
      } : undefined,
      company: review.company ? {
        id: review.company.id,
        name: review.company.name,
        profilePictureId: review.company.profilePictureId
      } : undefined
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis:", error);
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
  } as UpdateReviewDto;

  if (!data.rating && !data.comment) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.update({
      where: {
        id: id,
      },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment && { comment: data.comment }),
      },
      include: {
        company: true,
        student: true,
      },
    });
    
    // Conversion en ResponseDto
    const responseDto: ReviewResponseDto = {
      id: review.id,
      studentId: review.studentId,
      companyId: review.companyId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      modifiedAt: review.modifiedAt,
      deletedAt: review.deletedAt,
      student: review.student ? {
        id: review.student.id,
        firstName: review.student.firstName,
        lastName: review.student.lastName,
        profilePictureId: review.student.profilePictureId
      } : undefined,
      company: review.company ? {
        id: review.company.id,
        name: review.company.name,
        profilePictureId: review.company.profilePictureId
      } : undefined
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}