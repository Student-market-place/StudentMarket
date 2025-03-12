import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { SkillResponseDto } from "@/types/dto/skill.dto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            students: true,
            company_offers: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: SkillResponseDto[] = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      createdAt: skill.createdAt,
      modifiedAt: skill.modifiedAt,
      deletedAt: skill.deletedAt,
      studentCount: skill._count.students,
      offerCount: skill._count.company_offers
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des compétences" },
      { status: 500 }
    );
  }
} 