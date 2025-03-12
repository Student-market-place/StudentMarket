import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IParams } from "@/types/api.type";
import { CompanyOfferResponseDto } from "@/types/dto/company-offer.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company_offers = await prisma.company_offer.findMany({
      where: {
        companyId: id,
        deletedAt: null,
      },
      include: {
        company: true,
        skills: true,
        studentApplies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion en tableau de ResponseDto
    const responseDtos: CompanyOfferResponseDto[] = company_offers.map(offer => ({
      id: offer.id,
      companyId: offer.companyId,
      title: offer.title,
      description: offer.description,
      expectedSkills: offer.expectedSkills,
      startDate: offer.startDate,
      type: offer.type,
      status: offer.status,
      createdAt: offer.createdAt,
      modifiedAt: offer.modifiedAt,
      deletedAt: offer.deletedAt,
      company: offer.company ? {
        id: offer.company.id,
        name: offer.company.name,
        profilePictureId: offer.company.profilePictureId
      } : undefined,
      skills: offer.skills.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      studentAppliesCount: offer.studentApplies.length
    }));

    return NextResponse.json(responseDtos, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des offres de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des offres de l'entreprise" },
      { status: 500 }
    );
  }
}
