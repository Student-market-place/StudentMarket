import { UploadFile, User, Prisma } from "@prisma/client";

export interface Company {
  id: string;
  name: string;
  description: string;
  profilePictureId: string;
  userId: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
}

export type CompanyWithRelation = Prisma.CompanyGetPayload<{
  include: {
    profilePicture: true;
    user: true;
    _count: {
      select: {
        companyOffers: true;
      };
    };
  };
}>;

export interface CompanyFormData {
  userId: string;
  profilePicture: string;
  name: string;
  description: string;
}
