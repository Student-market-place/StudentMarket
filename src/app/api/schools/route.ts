import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { SchoolResponseDto } from "@/types/dto/school.dto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      include: {
        user: true,
        profilePicture: true,
        students: true
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: SchoolResponseDto[] = schools.map(school => ({
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school.students.length
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des écoles:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des écoles" },
      { status: 500 }
    );
  }
} 