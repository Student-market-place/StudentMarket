import { IParams } from "@/types/api.type";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
        { error: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
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
        { error: "user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: IParams
) {
  try {
    const { id } = await params;
    const { role } = await req.json();
    
    if (!role || !["student", "company"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        role: role 
      },
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rôle" },
      { status: 500 }
    );
  }
}
