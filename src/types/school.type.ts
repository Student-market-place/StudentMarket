import { UploadFile, User } from "@prisma/client";
export interface School {
    id: string;
    name: string;
    domainName: string;
    isActive: boolean;
    profilePictureId: UploadFile | string;
    userId: User | string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}