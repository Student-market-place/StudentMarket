import { PrismaClient, Prisma, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CreateStudentDto, StudentResponseDto, StudentSearchDto } from "@/types/dto/student.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const availableParam = searchParams.get("available");
    const statusParam = searchParams.get("status");
    const skillsParams = searchParams.getAll("skills");
    const queryParam = searchParams.get("query");
    const schoolIdParam = searchParams.get("schoolId");

    // Construction du DTO de recherche
    const searchDto: StudentSearchDto = {
      isAvailable: availableParam === "true" ? true : 
                  availableParam === "false" ? false : undefined,
      status: statusParam as EnumStatusTYpe | undefined,
      skills: skillsParams.length > 0 ? skillsParams : undefined,
      schoolId: schoolIdParam || undefined,
      query: queryParam || undefined
    };

    // Construction des conditions de recherche pour Prisma
    const where: Prisma.StudentWhereInput = {};

    if (searchDto.isAvailable !== undefined) {
      where.isAvailable = searchDto.isAvailable;
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    if (searchDto.schoolId) {
      where.schoolId = searchDto.schoolId;
    }

    if (searchDto.skills && searchDto.skills.length > 0) {
      where.skills = { some: { id: { in: searchDto.skills } } };
    }

    if (searchDto.query) {
      where.OR = [
        { firstName: { contains: searchDto.query, mode: 'insensitive' } },
        { lastName: { contains: searchDto.query, mode: 'insensitive' } },
        { description: { contains: searchDto.query, mode: 'insensitive' } }
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion en StudentResponseDto
    const responseDto: StudentResponseDto[] = students.map(student => ({
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
      skills: student.skills ? student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })) : undefined,
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    }));

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des étudiants",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data = rawData as CreateStudentDto;

    if (!data.userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier et formater les skills
    const skillIds = Array.isArray(data.skills) ? data.skills : [];

    // Créer d'abord l'étudiant
    const studentData: Prisma.StudentCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      status: data.status,
      isAvailable: data.isAvailable ?? true,
      description: data.description,
      user: {
        connect: {
          id: data.userId
        }
      },
      school: {
        connect: {
          id: data.schoolId
        }
      }
    };

    // Ajouter les skills seulement s'il y en a
    if (skillIds.length > 0) {
      studentData.skills = {
        connect: skillIds.map((id: string) => ({ id }))
      };
    }

    const student = await prisma.student.create({
      data: studentData,
      include: {
        skills: true,
        user: true,
        school: true
      }
    });

    // Mettre à jour l'étudiant avec les fichiers si nécessaire
    const updateData: Prisma.StudentUpdateInput = {};

    // Vérifier si les données brutes contiennent des informations de fichier
    if ('CVId' in rawData && rawData.CVId) {
      updateData.CV = { connect: { id: rawData.CVId } };
    }

    if ('profilePictureId' in rawData && rawData.profilePictureId) {
      updateData.profilePicture = { connect: { id: rawData.profilePictureId } };
    }

    if (Object.keys(updateData).length > 0) {
      const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: updateData,
        include: {
          skills: true,
          user: true,
          school: true,
          CV: true,
          profilePicture: true
        }
      });
      
      // Conversion en StudentResponseDto
      const responseDto: StudentResponseDto = {
        id: updatedStudent.id,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        status: updatedStudent.status,
        description: updatedStudent.description,
        isAvailable: updatedStudent.isAvailable,
        userId: updatedStudent.userId,
        schoolId: updatedStudent.schoolId,
        CVId: updatedStudent.CVId,
        profilePictureId: updatedStudent.profilePictureId,
        createdAt: updatedStudent.createdAt,
        school: updatedStudent.school ? {
          id: updatedStudent.school.id,
          name: updatedStudent.school.name
        } : undefined,
        skills: updatedStudent.skills ? updatedStudent.skills.map(skill => ({
          id: skill.id,
          name: skill.name
        })) : undefined,
        user: updatedStudent.user ? {
          id: updatedStudent.user.id,
          email: updatedStudent.user.email,
          name: updatedStudent.user.name
        } : undefined
      };
      
      return NextResponse.json(responseDto, { status: 201 });
    }

    // Conversion en StudentResponseDto
    const responseDto: StudentResponseDto = {
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
      skills: student.skills ? student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })) : undefined,
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'étudiant:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'étudiant" },
      { status: 500 }
    );
  }
}
