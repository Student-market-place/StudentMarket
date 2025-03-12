import { IParams } from "@/types/api.type";
import { PrismaClient, Prisma, EnumStatusTYpe } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { StudentResponseDto, UpdateStudentDto } from "@/types/dto/student.dto";

const prisma = new PrismaClient();

interface StudentUpdateData extends Omit<Prisma.StudentUpdateInput, "status"> {
  firstName: string;
  lastName: string;
  status: EnumStatusTYpe;
  description: string;
  isAvailable: boolean;
  user: { connect: { id: string } };
  skills?: { set: { id: string }[] };
  school: { connect: { id: string } };
  CV?: { connect: { id: string } };
  profilePicture?: { connect: { id: string } };
}

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  console.log(req);
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    // Conversion en ResponseDto
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
      skills: student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'étudiant:", error);
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
  } as UpdateStudentDto;

  if (!data.firstName && !data.lastName && !data.status && !data.description 
      && data.isAvailable === undefined && !data.schoolId && data.CVId === undefined 
      && data.profilePictureId === undefined && (!data.skills || data.skills.length === 0)) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    // Construire l'objet de données pour la mise à jour
    const updateData: any = {};
    
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.status) updateData.status = data.status;
    if (data.description) updateData.description = data.description;
    if (typeof data.isAvailable !== 'undefined') updateData.isAvailable = data.isAvailable;
    if (data.schoolId) updateData.school = { connect: { id: data.schoolId } };
    if (data.CVId !== undefined) {
      if (data.CVId) {
        updateData.CV = { connect: { id: data.CVId } };
      } else {
        updateData.CV = { disconnect: true };
      }
    }
    if (data.profilePictureId !== undefined) {
      if (data.profilePictureId) {
        updateData.profilePicture = { connect: { id: data.profilePictureId } };
      } else {
        updateData.profilePicture = { disconnect: true };
      }
    }
    
    // Mise à jour des compétences si fournies
    if (data.skills && data.skills.length > 0) {
      updateData.skills = {
        set: data.skills.map(skillId => ({ id: skillId }))
      };
    }

    const student = await prisma.student.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
    });

    // Conversion en ResponseDto
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
      skills: student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étudiant:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student = await prisma.student.delete({
      where: {
        id: id,
      },
      include: {
        user: true,
        skills: true,
        school: true,
        CV: true,
        profilePicture: true,
      },
    });
    
    if (!student) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    
    // Conversion en ResponseDto
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
      skills: student.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      user: student.user ? {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name
      } : undefined
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'étudiant:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
