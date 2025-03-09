import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const company = await prisma.company.findMany();
  return NextResponse.json(company, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

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

    // Créer d'abord l'entreprise sans la photo de profil
    const companyData: Prisma.CompanyCreateInput = {
      name: data.name,
      description: data.description,
      user: {
        connect: {
          id: data.userId
        }
      }
    };

    try {
      // Créer l'entreprise
      const company = await prisma.company.create({
        data: companyData,
        include: {
          user: true,
          profilePicture: true
        }
      });

      // Si une photo de profil est fournie, la créer et mettre à jour l'entreprise
      if (data.profilePicture) {
        const profilePicture = await prisma.uploadFile.create({
          data: {
            url: data.profilePicture,
            companies: {
              connect: {
                id: company.id
              }
            }
          }
        });

        // Mettre à jour l'entreprise avec la photo de profil
        const updatedCompany = await prisma.company.update({
          where: {
            id: company.id
          },
          data: {
            profilePictureId: profilePicture.id
          },
          include: {
            user: true,
            profilePicture: true
          }
        });

        return NextResponse.json(updatedCompany);
      }

      return NextResponse.json(company);
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'entreprise:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de l'entreprise" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}
