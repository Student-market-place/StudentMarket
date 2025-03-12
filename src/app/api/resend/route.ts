import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// DTO pour l'envoi d'emails
interface EmailSendDto {
  to: string;
  subject: string;
  url: string;
}

// DTO pour la réponse d'envoi d'email
interface EmailResponseDto {
  id?: string;
  success: boolean;
  message: string;
}

const resend = new Resend(process.env.NEXT_PUBLIC_AUTH_RESEND_KEY);

export async function POST(req: NextRequest) {
  try {
    // Lire et typer les données
    const rawData = await req.json();
    const data = rawData as EmailSendDto;

    if (!data.to || !data.subject || !data.url) {
      const response: EmailResponseDto = {
        success: false,
        message: "Les champs to, subject et url sont requis"
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data: resendData, error } = await resend.emails.send({
      from: "no-reply@1ucas1eveque.fr",
      to: [data.to],
      subject: data.subject,
      html: `
        <div>
          <h1>Bienvenue sur Student Market</h1>
          <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
          <a href="${data.url}">Se connecter</a>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      
      const response: EmailResponseDto = {
        success: false,
        message: "Erreur lors de l'envoi de l'email"
      };
      
      return NextResponse.json(response, { status: 500 });
    }

    const response: EmailResponseDto = {
      id: resendData?.id,
      success: true,
      message: "Email envoyé avec succès"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    
    const response: EmailResponseDto = {
      success: false,
      message: "Erreur lors de l'envoi de l'email"
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
