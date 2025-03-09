import { auth } from "@/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Intercepte les callbacks d'authentification pour stocker l'email dans un cookie
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // Obtenir la session actuelle
    const session = await auth();
    const email = session?.user?.email;

    console.log("👤 Callback détecté, utilisateur:", session?.user);
    console.log("🔐 Provider:", params.provider);

    // Rediriger vers la page demandée dans le callbackUrl ou la page d'accueil par défaut
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/auth/create-account";
    const redirectUrl = new URL(callbackUrl, request.url);
    
    // Ajouter l'email à l'URL de redirection si disponible
    if (email) {
      redirectUrl.searchParams.set("email", email);
    }

    // Créer la réponse de redirection
    const response = NextResponse.redirect(redirectUrl);

    // Si nous avons un email dans la session, le stocker dans un cookie
    if (email) {
      console.log("📧 Stockage de l'email dans un cookie:", email);
      
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