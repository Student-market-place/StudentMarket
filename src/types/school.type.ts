import { Student, UploadFile, User, Prisma } from "@prisma/client";

export interface School {
  id: string;
  name: string;
  domainName: string;
  isActive: boolean;
  profilePictureId: UploadFile | string;
  students: Student[] | string;
  userId: User | string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
}

export type SchoolWithRelations = Prisma.SchoolGetPayload<{
  include: {
    user: true;
    profilePicture: true;
    students: true;
  };
}>;
