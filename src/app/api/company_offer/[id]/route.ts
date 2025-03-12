import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IParams } from "@/types/api.type";
import { UpdateCompanyOfferDto, CompanyOfferResponseDto } from "@/types/dto/company-offer.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: IParams) {
  const { id } = await params;
  try {
    const company_offer = await prisma.company_offer.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
        skills: true,
        studentApplies: true,
      }
    });

    if (!company_offer) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      );
    }

    // Conversion en ResponseDto
    const responseDto: CompanyOfferResponseDto = {
      id: company_offer.id,
      companyId: company_offer.companyId,
      title: company_offer.title,
      description: company_offer.description,
      expectedSkills: company_offer.expectedSkills,
      startDate: company_offer.startDate,
      type: company_offer.type,
      status: company_offer.status,
      createdAt: company_offer.createdAt,
      modifiedAt: company_offer.modifiedAt,
      deletedAt: company_offer.deletedAt,
      company: company_offer.company ? {
        id: company_offer.company.id,
        name: company_offer.company.name,
        profilePictureId: company_offer.company.profilePictureId
      } : undefined,
      skills: company_offer.skills?.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      studentAppliesCount: company_offer.studentApplies.length
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'offre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  try {
    const company_offer = await prisma.company_offer.delete({
      where: {
        id: id,
      },
      include: {
        skills: true
      }
    });
    
    if (!company_offer) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      );
    }
    
    // Conversion en ResponseDto
    const responseDto: CompanyOfferResponseDto = {
      id: company_offer.id,
      companyId: company_offer.companyId,
      title: company_offer.title,
      description: company_offer.description,
      expectedSkills: company_offer.expectedSkills,
      startDate: company_offer.startDate,
      type: company_offer.type,
      status: company_offer.status,
      createdAt: company_offer.createdAt,
      modifiedAt: company_offer.modifiedAt,
      deletedAt: company_offer.deletedAt,
      skills: company_offer.skills?.map(skill => ({
        id: skill.id,
        name: skill.name
      }))
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'offre:", error);
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
  } as UpdateCompanyOfferDto;

  if (!data.title && !data.description && !data.expectedSkills && !data.startDate && !data.type && !data.status && !data.skills) {
    return NextResponse.json(
      { error: "Au moins un champ à mettre à jour est requis" },
      { status: 400 }
    );
  }

  try {
    // Mettre à jour l'offre
    const company_offer = await prisma.company_offer.update({
      where: {
        id: id,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.expectedSkills && { expectedSkills: data.expectedSkills }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status })
      },
      include: {
        company: true,
        skills: true
      }
    });
    
    // Mettre à jour les compétences si nécessaire
    if (data.skills && data.skills.length > 0) {
      // Supprimer toutes les relations existantes
      await prisma.company_offer.update({
        where: { id: id },
        data: {
          skills: {
            set: []
          }
        }
      });
      
      // Ajouter les nouvelles relations
      await prisma.company_offer.update({
        where: { id: id },
        data: {
          skills: {
            connect: data.skills.map(skillId => ({ id: skillId }))
          }
        }
      });
    }
    
    // Récupérer l'offre mise à jour avec ses compétences
    const updatedOffer = await prisma.company_offer.findUnique({
      where: { id: id },
      include: {
        company: true,
        skills: true,
        studentApplies: true
      }
    });
    
    if (!updatedOffer) {
      return NextResponse.json(
        { error: "Offre non trouvée après mise à jour" },
        { status: 404 }
      );
    }
    
    // Conversion en ResponseDto
    const responseDto: CompanyOfferResponseDto = {
      id: updatedOffer.id,
      companyId: updatedOffer.companyId,
      title: updatedOffer.title,
      description: updatedOffer.description,
      expectedSkills: updatedOffer.expectedSkills,
      startDate: updatedOffer.startDate,
      type: updatedOffer.type,
      status: updatedOffer.status,
      createdAt: updatedOffer.createdAt,
      modifiedAt: updatedOffer.modifiedAt,
      deletedAt: updatedOffer.deletedAt,
      company: updatedOffer.company ? {
        id: updatedOffer.company.id,
        name: updatedOffer.company.name,
        profilePictureId: updatedOffer.company.profilePictureId
      } : undefined,
      skills: updatedOffer.skills?.map(skill => ({
        id: skill.id,
        name: skill.name
      })),
      studentAppliesCount: updatedOffer.studentApplies.length
    };
    
    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'offre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
