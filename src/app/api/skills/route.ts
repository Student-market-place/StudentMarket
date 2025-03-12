import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { SkillResponseDto, CreateSkillDto } from "@/types/dto/skill.dto";

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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as CreateSkillDto;
    
    // Vérification des données requises
    if (!data.name) {
      return NextResponse.json(
        { error: "Le nom de la compétence est requis" },
        { status: 400 }
      );
    }
    
    // Création de la compétence
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
      },
    });
    
    const responseDto: SkillResponseDto = {
      id: skill.id,
      name: skill.name,
      createdAt: skill.createdAt,
      modifiedAt: skill.modifiedAt,
      deletedAt: skill.deletedAt,
      studentCount: 0,
      offerCount: 0
    };
    
    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la compétence:", error);
    return NextResponse.json(
      { error: "Échec de la création de la compétence" },
      { status: 500 }
    );
  }
} 