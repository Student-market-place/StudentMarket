import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/student_apply/student/[id]
 * 
 * Récupère toutes les candidatures d'un étudiant spécifique
 * @param request - Requête HTTP
 * @param params - Paramètres d'URL, contient l'ID de l'étudiant
 * @returns Liste des candidatures de l'étudiant avec les relations (offre, entreprise)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer toutes les candidatures de l'étudiant
    const studentApplies = await prisma.student_apply.findMany({
      where: {
        studentId: studentId,
        deletedAt: null,
      },
      include: {
        companyOffer: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(studentApplies);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des candidatures" },
      { status: 500 }
    );
  }
} 