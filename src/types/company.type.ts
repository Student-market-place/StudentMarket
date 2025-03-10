import { UploadFile, User, Prisma } from "@prisma/client";

export interface Company {
  id: string;
  name: string;
  description: string;
  profilePictureId: string | UploadFile;
  userId: string | User;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
}

export type CompanyWithRelation = Prisma.CompanyGetPayload<{
  include: {
    profilePicture: true;
    user: true;
  };
}>;

export interface CompanyFormData {
  userId: string;
  profilePicture: string;
  name: string;
  description: string;
}
