import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateReviewDto, ReviewResponseDto, ReviewSearchDto } from "@/types/dto/review.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentParam = searchParams.get("student");

    // Construction du DTO de recherche
    const searchDto: ReviewSearchDto = {
      studentId: studentParam || undefined
    };

    // Construction du filtre
    const where: any = {};

    if (searchDto.studentId) {
      where.studentId = searchDto.studentId;
    }

    // Exécution de la requête
    const reviews = await prisma.review.findMany({
      include: {
        company: true,
        student: true,
      },
      where,
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
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des avis",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Lire les données brutes
  const rawData = await req.json();
  // Typer en tant que DTO
  const data = rawData as CreateReviewDto;

  if (!data.studentId || !data.companyId || !data.rating || !data.comment) {
    return NextResponse.json(
      { error: "studentId, companyId, rating, comment sont requis" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        student: { connect: { id: data.studentId } },
        company: { connect: { id: data.companyId } },
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        company: true,
        student: true,
      }
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
    
    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
