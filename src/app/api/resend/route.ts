import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.NEXT_PUBLIC_AUTH_RESEND_KEY);

export async function POST(req: NextRequest) {
  console.log("📧 Début de l'envoi d'email");
  
  try {
    const body = await req.json();
    const { from, to, subject, url } = body;
    console.log("📝 Données reçues:", { from, to, subject });

    if (!to || !url) {
      console.error("❌ Données manquantes");
      return Response.json(
        { error: "Email et URL sont requis" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Bienvenue sur Student Market</h1>
          <p>Bonjour,</p>
          <p>Cliquez sur le lien ci-dessous pour vous connecter à votre compte :</p>
          <a href="${url}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Se connecter
          </a>
          <p style="color: #666;">Ce lien expire dans 24 heures.</p>
          <p style="color: #666;">Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet email.</p>
        </div>
      `,
    });

    console.log("✅ Email envoyé avec succès", data);

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data, url });
  } catch (error) {
    console.error("❌ Erreur inattendue:", error);
    return Response.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
