import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { SessionEmailResponseDto } from "@/types/dto/auth.dto";

// Route pour récupérer l'email de la session
export async function GET() {
  try {
    // Récupérer la session via auth
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Aucun email dans la session" },
        { status: 404 }
      );
    }

    // Construction du DTO de réponse
    const responseDto: SessionEmailResponseDto = {
      email
    };

    // Retourner l'email
    return NextResponse.json(responseDto);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'email:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Route pour stocker l'email dans un cookie dédié
export async function POST() {
  try {
    // Récupérer la session via auth
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Aucun email dans la session" },
        { status: 404 }
      );
    }

    // Construction du DTO de réponse
    const responseDto: SessionEmailResponseDto = {
      email,
      success: true
    };

    // Créer une réponse avec l'email
    const response = NextResponse.json(responseDto);
    
    // Ajouter le cookie à la réponse
    response.cookies.set("user-email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 jour
      path: "/",
    });

    // Retourner la réponse avec le cookie
    return response;
  } catch (error) {
    console.error("Erreur lors du stockage de l'email:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 