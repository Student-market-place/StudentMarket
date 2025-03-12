import { IParams } from "@/types/api.type";
import { PrismaClient, Role, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { 
  CreateSchoolDto, 
  UpdateSchoolDto, 
  SchoolResponseDto, 
  SchoolSearchDto 
} from "@/types/dto/school.dto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const isActiveParam = searchParams.get("isActive");
    const queryParam = searchParams.get("query");

    // Construction du DTO de recherche
    const searchDto: SchoolSearchDto = {
      isActive: isActiveParam === "true" ? true : 
                isActiveParam === "false" ? false : undefined,
      query: queryParam || undefined
    };

    // Construction des conditions de recherche pour Prisma
    const where: Prisma.SchoolWhereInput = {
      deletedAt: null
    };

    if (searchDto.isActive !== undefined) {
      where.isActive = searchDto.isActive;
    }

    if (searchDto.query) {
      where.OR = [
        { name: { contains: searchDto.query, mode: 'insensitive' } },
        { domainName: { contains: searchDto.query, mode: 'insensitive' } }
      ];
    }

    const schools = await prisma.school.findMany({
      where,
      include: {
        user: true,
        profilePicture: true,
        _count: {
          select: {
            students: true
          }
        }
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

    // Conversion en ResponseDto
    const responseDto: SchoolResponseDto[] = schools.map(school => ({
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school._count.students
    }));

    return NextResponse.json(responseDto, { status: 200 });
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

  try {
    // Lire les données brutes une seule fois
    const rawData = await req.json();
    // Typer ensuite en tant que DTO
    const data: UpdateSchoolDto = {
      id,
      name: rawData.name,
      domainName: rawData.domainName,
      isActive: rawData.isActive,
      profilePictureId: rawData.profilePictureId
    };

    if (!data.name || !data.domainName) {
      return NextResponse.json(
        { error: "Le nom et le nom de domaine sont requis" },
        { status: 400 }
      );
    }

    const updateData: Prisma.SchoolUpdateInput = {
      name: data.name,
      domainName: data.domainName,
      isActive: data.isActive
    };

    if (data.profilePictureId) {
      updateData.profilePicture = { connect: { id: data.profilePictureId } };
    }

    // Mettre à jour l'email si présent
    if (rawData.email) {
      updateData.user = {
        update: {
          email: rawData.email
        }
      };
    }

    const school = await prisma.school.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        user: true,
        profilePicture: true,
        _count: {
          select: {
            students: true
          }
        }
      },
    });

    // Conversion en ResponseDto
    const responseDto: SchoolResponseDto = {
      id: school.id,
      name: school.name,
      domainName: school.domainName,
      isActive: school.isActive,
      profilePictureId: school.profilePictureId,
      userId: school.userId,
      createdAt: school.createdAt,
      modifiedAt: school.modifiedAt,
      user: school.user ? {
        id: school.user.id,
        email: school.user.email,
        name: school.user.name
      } : undefined,
      profilePicture: school.profilePicture ? {
        id: school.profilePicture.id,
        url: school.profilePicture.url
      } : undefined,
      studentCount: school._count.students
    };

    return NextResponse.json(responseDto, { status: 200 });
  } catch (error) {
    console.error("Error updating school:", error);
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
        { error: "Le nom, le nom de domaine et l'email sont requis" },
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
      
      // Créer l'utilisateur d'abord
      const user = await prisma.user.create({
        data: {
          email,
          role: "school" as Role,
          name: name,
        }
      });
      
      // Puis créer l'école avec les relations
      const school = await prisma.school.create({
        data: {
          name,
          domainName,
          isActive: isActive ?? false,
          user: {
            connect: {
              id: user.id
            }
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
          _count: {
            select: {
              students: true
            }
          }
        },
      });

      // Conversion en ResponseDto
      const responseDto: SchoolResponseDto = {
        id: school.id,
        name: school.name,
        domainName: school.domainName,
        isActive: school.isActive,
        profilePictureId: school.profilePictureId,
        userId: school.userId,
        createdAt: school.createdAt,
        modifiedAt: school.modifiedAt,
        user: school.user ? {
          id: school.user.id,
          email: school.user.email,
          name: school.user.name
        } : undefined,
        profilePicture: school.profilePicture ? {
          id: school.profilePicture.id,
          url: school.profilePicture.url
        } : undefined,
        studentCount: school._count.students
      };

      console.log("School created successfully:", school);
      return NextResponse.json(responseDto, { status: 201 });
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
