import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const student_history = await prisma.student_history.findUnique({
      where: {
        id: id,
      },
    });

    if (!student_history) {
      return NextResponse.json(
        { error: "student_history not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student_history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const student_history = await prisma.student_history.delete({
      where: {
        id: id,
      },
    });
    if (!student_history) {
      return NextResponse.json(
        { error: "student_history not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(student_history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
 const { id } = await params;
   const {       
      studentId,
      companyId,
      startDate,
      endDate,  
   } = await req.json();
 
    if (!studentId || !companyId || !startDate || !endDate) {
     return NextResponse.json(
       { error: "Veuillez renseigner tous les champs obligatoires" },
       { status: 400 }
     );
   }
 
   try {
     const student_history = await prisma.student_history.update({
       where: {
         id: id,
       },
       data: {
          student: { connect: { id: studentId } },
          company: { connect: { id: companyId } },
          startDate,
          endDate,
       },
      });


      return NextResponse.json(student_history, { status: 200 });
   } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
}
    
