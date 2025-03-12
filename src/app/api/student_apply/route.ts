import { PrismaClient, Apply_Status, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { 
  CreateStudentApplyDto, 
  StudentApplyResponseDto, 
  StudentApplySearchDto 
} from "@/types/dto/student-apply.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const companyOfferIdParam = searchParams.get("companyOfferId");
    const studentIdParam = searchParams.get("studentId");
    const companyIdParam = searchParams.get("companyId");
    const statusParam = searchParams.get("status");

    // Construction du DTO de recherche
    const searchDto: StudentApplySearchDto = {
      companyOfferId: companyOfferIdParam || undefined,
      studentId: studentIdParam || undefined,
      companyId: companyIdParam || undefined,
      status: statusParam as Apply_Status || undefined
    };

    // Construction des conditions de recherche pour Prisma
    const where: Prisma.Student_applyWhereInput = {
      deletedAt: null
    };

    if (searchDto.companyOfferId) {
      where.companyOfferId = searchDto.companyOfferId;
    }

    if (searchDto.studentId) {
      where.studentId = searchDto.studentId;
    }

    if (searchDto.companyId) {
      where.companyOffer = {
        companyId: searchDto.companyId
      };
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    }

    const student_applies = await prisma.student_apply.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureId: true
          }
        },
        companyOffer: {
          select: {
            id: true,
            title: true,
            companyId: true,
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Conversion en ResponseDto
    const responseDto: StudentApplyResponseDto[] = student_applies.map(apply => ({
      id: apply.id,
      studentId: apply.studentId,
      companyOfferId: apply.companyOfferId,
      message: apply.message,
      status: apply.status,
      createdAt: apply.createdAt,
      modifiedAt: apply.modifiedAt,
      deletedAt: apply.deletedAt,
      student: apply.student ? {
        id: apply.student.id,
        firstName: apply.student.firstName,
        lastName: apply.student.lastName,
        profilePictureId: apply.student.profilePictureId
      } : undefined,
      companyOffer: apply.companyOffer ? {
        id: apply.companyOffer.id,
        title: apply.companyOffer.title,
        companyId: apply.companyOffer.companyId,
        company: apply.companyOffer.company ? {
          id: apply.companyOffer.company.id,
          name: apply.companyOffer.company.name
        } : undefined
      } : undefined
    }));

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la récupération des demandes d'étudiant",
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
    const data = rawData as CreateStudentApplyDto;

    if (!data.studentId || !data.companyOfferId || !data.message) {
      return NextResponse.json(
        { error: "studentId, companyOfferId, et message sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: data.studentId }
    });

    if (!student) {
      return NextResponse.json(
        { error: "L'étudiant spécifié n'existe pas" },
        { status: 404 }
      );
    }

    // Vérifier que l'offre existe
    const offer = await prisma.company_offer.findUnique({
      where: { id: data.companyOfferId }
    });

    if (!offer) {
      return NextResponse.json(
        { error: "L'offre spécifiée n'existe pas" },
        { status: 404 }
      );
    }

    const student_apply = await prisma.student_apply.create({
      data: {
        status: data.status || "en_attente",
        student: { connect: { id: data.studentId } },
        companyOffer: { connect: { id: data.companyOfferId } },
        message: data.message,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureId: true
          }
        },
        companyOffer: {
          select: {
            id: true,
            title: true,
            companyId: true,
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
    });

    // Conversion en ResponseDto
    const responseDto: StudentApplyResponseDto = {
      id: student_apply.id,
      studentId: student_apply.studentId,
      companyOfferId: student_apply.companyOfferId,
      message: student_apply.message,
      status: student_apply.status,
      createdAt: student_apply.createdAt,
      modifiedAt: student_apply.modifiedAt,
      deletedAt: student_apply.deletedAt,
      student: student_apply.student ? {
        id: student_apply.student.id,
        firstName: student_apply.student.firstName,
        lastName: student_apply.student.lastName,
        profilePictureId: student_apply.student.profilePictureId
      } : undefined,
      companyOffer: student_apply.companyOffer ? {
        id: student_apply.companyOffer.id,
        title: student_apply.companyOffer.title,
        companyId: student_apply.companyOffer.companyId,
        company: student_apply.companyOffer.company ? {
          id: student_apply.companyOffer.company.id,
          name: student_apply.companyOffer.company.name
        } : undefined
      } : undefined
    };

    return NextResponse.json(responseDto, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Erreur lors de la création de la demande d'étudiant",
      },
      { status: 500 }
    );
  }
}
