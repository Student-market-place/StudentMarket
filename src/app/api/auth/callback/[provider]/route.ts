import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Intercepte les callbacks d'authentification pour stocker l'email dans un cookie
export async function GET(
  request: NextRequest,
) {
  try {
    // Obtenir l'email du token Resend s'il existe
    const emailFromToken = request.nextUrl.searchParams.get("email");
    
    // Obtenir la session actuelle
    const session = await auth();
    const emailFromSession = session?.user?.email;

    // Rediriger vers la page demandée dans le callbackUrl ou la page d'accueil par défaut
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/auth/create-account";
    const redirectUrl = new URL(callbackUrl, request.url);
    
    // Utiliser l'email du token Resend en priorité, sinon utiliser celui de la session
    const email = emailFromToken || emailFromSession;
    
    // Ajouter l'email à l'URL de redirection si disponible
    if (email) {
      redirectUrl.searchParams.set("email", email);
    }

    // Créer la réponse de redirection
    const response = NextResponse.redirect(redirectUrl);

    // Si nous avons un email, le stocker dans un cookie
    if (email) {
      // Stocker l'email dans un cookie
      response.cookies.set("user-email", email, {
        maxAge: 60 * 60 * 24, // 1 jour
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("❌ Erreur lors du traitement du callback:", error);
    
    // En cas d'erreur, rediriger vers la page d'accueil
    return NextResponse.redirect(new URL("/", request.url));
  }
} 