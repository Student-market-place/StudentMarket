import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latest = searchParams.get("latest");

    if (latest === "true") {
      const latestUser = await prisma.user.findFirst({
        orderBy: {
          createdAt: "desc"
        }
      });

      if (!latestUser) {
        return NextResponse.json(
          { error: "Aucun utilisateur trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json(latestUser);
    }

    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 