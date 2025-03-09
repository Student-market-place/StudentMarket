import { UploadFile, User } from "@prisma/client";
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

export interface CompanyFormData {
  userId: string;
  profilePicture: string;
  name: string;
  description: string;
}