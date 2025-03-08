import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const company = await prisma.company.findMany();
  return NextResponse.json(company, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🟦 Début de la création d'une entreprise");
    const data = await req.json();
    console.log("📥 Données reçues:", data);

    if (!data.userId) {
      console.log("❌ Erreur: userId manquant");
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
      console.log("❌ Erreur: Utilisateur non trouvé pour l'ID:", data.userId);
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    console.log("✅ Utilisateur trouvé:", user);

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

    console.log("📝 Création de l'entreprise avec les données:", companyData);

    try {
      // Créer l'entreprise
      const company = await prisma.company.create({
        data: companyData,
        include: {
          user: true,
          profilePicture: true
        }
      });

      console.log("✅ Entreprise créée avec succès:", company);

      // Si une photo de profil est fournie, la créer et mettre à jour l'entreprise
      if (data.profilePicture) {
        console.log("📸 Création de l'entrée pour la photo de profil");
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

        console.log("✅ Photo de profil créée avec succès:", profilePicture);

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

        console.log("✅ Entreprise mise à jour avec la photo de profil:", updatedCompany);
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
