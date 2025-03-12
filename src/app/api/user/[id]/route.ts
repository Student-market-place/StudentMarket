import { IParams } from "@/types/api.type";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UpdateUserDto, UserResponseDto } from "@/types/dto/user.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const include = searchParams.get('include')?.split(',');

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        student: include?.includes('student') ? {
          include: {
            profilePicture: true,
            CV: true
          }
        } : false,
        company: include?.includes('company') ? {
          include: {
            profilePicture: true
          }
        } : false,
        school: include?.includes('school') ? {
          include: {
            profilePicture: true
          }
        } : false
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Conversion en ResponseDto
    const responseDto: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      studentId: user.student?.id,
      companyId: user.company?.id,
      schoolId: user.school?.id
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    // Conversion en ResponseDto
    const responseDto: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: IParams
) {
  try {
    const { id } = await params;
    
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data = {
      id,
      ...rawData
    } as UpdateUserDto;
    
    if (!data.role && !data.name && !data.email && !data.image) {
      return NextResponse.json(
        { error: "Au moins un champ à mettre à jour est requis" },
        { status: 400 }
      );
    }

    if (data.role && !["student", "company", "admin", "school"].includes(data.role)) {
      return NextResponse.json(
        { error: "Rôle invalide" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (data.role) updateData.role = data.role;
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.image) updateData.image = data.image;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          include: {
            profilePicture: true,
            CV: true
          }
        },
        company: {
          include: {
            profilePicture: true
          }
        },
        school: {
          include: {
            profilePicture: true
          }
        }
      }
    });

    // Conversion en ResponseDto
    const responseDto: UserResponseDto = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      image: updatedUser.image,
      createdAt: updatedUser.createdAt,
      studentId: updatedUser.student?.id,
      companyId: updatedUser.company?.id,
      schoolId: updatedUser.school?.id
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
