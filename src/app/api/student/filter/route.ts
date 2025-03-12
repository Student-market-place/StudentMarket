import { Prisma, PrismaClient, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { StudentResponseDto, StudentSearchDto } from "@/types/dto/student.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des paramètres de filtrage
    const availability = searchParams.get("availability");
    const contractType = searchParams.get("contractType");
    const skillsParam = searchParams.get("skills");
    const schoolId = searchParams.get("school");

    // Construction du DTO de recherche
    const searchDto: StudentSearchDto = {
      isAvailable: availability ? availability === "true" : undefined,
      status: contractType as EnumStatusTYpe || undefined,
      schoolId: schoolId || undefined,
      skills: skillsParam ? skillsParam.split(",") : undefined
    };

    // Construction de la requête avec les filtres
    const whereClause: Prisma.StudentWhereInput = {
      deletedAt: null,
    };

    // Filtre par disponibilité
    if (typeof searchDto.isAvailable !== 'undefined') {
      whereClause.isAvailable = searchDto.isAvailable;
    }

    // Filtre par type de contrat
    if (searchDto.status) {
      whereClause.status = searchDto.status;
    }

    // Filtre par école
    if (searchDto.schoolId) {
      whereClause.schoolId = searchDto.schoolId;
    }

    // Si on filtre par compétences
    if (searchDto.skills && searchDto.skills.length > 0) {
      const skillIds = searchDto.skills;

      if (skillIds.length === 1) {
        whereClause.skills = {
          some: {
            id: skillIds[0],
          },
        };
      } else if (skillIds.length > 1) {
        whereClause.AND = skillIds.map((skillId) => ({
          skills: {
            some: {
              id: skillId,
            },
          },
        }));
      }
    }

    const query: Prisma.StudentFindManyArgs = {
      where: whereClause,
      include: {
        user: true,
        skills: true,
        school: true,
        profilePicture: true,
        CV: true,
      },
    };

    // Définition du type pour les résultats inclus
    type StudentWithRelations = Prisma.StudentGetPayload<{
      include: {
        user: true;
        skills: true;
        school: true;
        profilePicture: true;
        CV: true;
      }
    }>;

    // Requête avec toutes les conditions
    const students = await prisma.student.findMany(query) as StudentWithRelations[];

    // Conversion en tableau de ResponseDto
    const responseDtos: StudentResponseDto[] = students.map((student: StudentWithRelations) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      status: student.status,
      description: student.description,
      isAvailable: student.isAvailable,
      userId: student.userId,
      schoolId: student.schoolId,
      CVId: student.CVId,
      profilePictureId: student.profilePictureId,
      createdAt: student.createdAt,
      school: student.school ? {
        id: student.school.id,
        name: student.school.name
      } : undefined,
      skills: student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du filtrage des étudiants:", error);
    return NextResponse.json(
      { error: "Échec du filtrage des étudiants" },
      { status: 500 }
    );
  }
}
