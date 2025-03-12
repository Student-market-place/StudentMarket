import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";
import { ReviewResponseDto } from "@/types/dto/review.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        studentId: id,
      },
      include: {
        company: true,
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: ReviewResponseDto[] = reviews.map(review => ({
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
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis de l'étudiant" },
      { status: 500 }
    );
  }
}
