import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.findMany();
  return NextResponse.json(user, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    
    console.log("Creating user with role:", role);

    // Créer un utilisateur temporaire avec le rôle spécifié
    const user = await prisma.user.create({
      data: {
        role: role as "student" | "company",
        email: `temp_${Date.now()}@temp.com`, // Email temporaire
        name: "Temporary User"
      },
    });

    console.log("Created temporary user:", user);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


