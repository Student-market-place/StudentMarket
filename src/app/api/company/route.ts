import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const company = await prisma.company.findMany({
    include: {
      profilePicture: true,
      user: true,
      _count: {
        select: {
          companyOffers: true,
        },
      },
    },
  });
  return NextResponse.json(company, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si la photo de profil par défaut existe déjà
    let defaultProfilePicture = await prisma.uploadFile.findFirst({
      where: { url: "default-company-profile.jpg" },
    });

    // Si elle n'existe pas, la créer
    if (!defaultProfilePicture) {
      defaultProfilePicture = await prisma.uploadFile.create({
        data: {
          url: "default-company-profile.jpg",
        },
      });
    }

    // Créer l'entreprise avec la photo de profil par défaut
    const companyData: Prisma.CompanyCreateInput = {
      name: data.name,
      description: data.description,
      user: {
        connect: {
          id: data.userId,
        },
      },
      profilePicture: {
        connect: {
          id: defaultProfilePicture.id,
        },
      },
    };

    // Créer l'entreprise
    const company = await prisma.company.create({
      data: companyData,
      include: {
        user: true,
        profilePicture: true,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}
