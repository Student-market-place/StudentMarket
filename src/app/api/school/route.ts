import { IParams } from "@/types/api.type";
import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        user: true,
        profilePicture: true,
        students: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: IParams) {
  const { id } = await params;

  const { name, domainName, isActive, profilePictureId, email } =
    await req.json();

  if (!name || !domainName) {
    return NextResponse.json(
      { error: "name and domainName are required" },
      { status: 400 }
    );
  }

  try {
    const school = await prisma.school.update({
      where: {
        id: id,
      },
      data: {
        name,
        domainName,
        isActive,
        ...(profilePictureId && {
          profilePicture: { connect: { id: profilePictureId } },
        }),
        ...(email && {
          user: {
            update: {
              email,
            },
          },
        }),
      },
      include: {
        user: true,
        profilePicture: true,
      },
    });
    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, domainName, isActive, email } = await req.json();
    console.log("Received data:", { name, domainName, isActive, email });

    if (!name || !domainName || !email) {
      console.log("Validation failed: missing required fields");
      return NextResponse.json(
        { error: "name, domainName and email are required" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User with email already exists:", email);
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    try {
      // Create default profile picture if it doesn't exist
      console.log("Creating or finding default profile picture...");
      let defaultProfilePicture = await prisma.uploadFile.findFirst({
        where: { url: "default-school-profile.jpg" },
      });

      if (!defaultProfilePicture) {
        console.log("Creating new default profile picture...");
        defaultProfilePicture = await prisma.uploadFile.create({
          data: {
            url: "default-school-profile.jpg",
          },
        });
        console.log("Default profile picture created:", defaultProfilePicture);
      }

      console.log(
        "Creating school with profile picture:",
        defaultProfilePicture.id
      );
      const school = await prisma.school.create({
        data: {
          name,
          domainName,
          isActive: isActive ?? false,
          user: {
            create: {
              email,
              role: "school" as Role,
              name: name,
            },
          },
          profilePicture: {
            connect: {
              id: defaultProfilePicture.id,
            },
          },
        },
        include: {
          user: true,
          profilePicture: true,
          students: true,
        },
      });

      console.log("School created successfully:", school);
      return NextResponse.json(school, { status: 201 });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      if (dbError instanceof Error) {
        return NextResponse.json(
          {
            error: "Erreur lors de la création de l'école",
            details: dbError.message,
            name: dbError.name,
          },
          { status: 500 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Detailed error creating school:", {
      error,
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la création de l'école",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
