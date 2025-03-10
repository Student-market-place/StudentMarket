import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.NEXT_PUBLIC_AUTH_RESEND_KEY);

export async function POST(req: NextRequest) {
  try {
    const { from, to, subject, url } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "no-reply@1ucas1eveque.fr",
      to: [to],
      subject: subject,
      html: `
        <div>
          <h1>Bienvenue sur Student Market</h1>
          <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
          <a href="${url}">Se connecter</a>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
