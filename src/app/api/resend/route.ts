import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.NEXT_PUBLIC_AUTH_RESEND_KEY);

export async function POST(req: NextRequest) {
  console.log("Resend auth");
  const body = await req.json();
  const { from, to, subject, url } = body;
  console.log("Resend auth body", body);

  console.log(body);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html: `<p>Hello from booking app : ${url} </p>`,
    });

    console.log("Resend auth url", url);
    console.log("Resend auth data", data);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data, url });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
