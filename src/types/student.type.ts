import { User, School, UploadFile } from "@prisma/client";

enum Status {
    STAGIAIRE = 'Stagiaire',
    ALTERNANT = 'Alternant',
}


export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    status: Status;
    description: string;
    isAvailable: boolean;
    userId: string | User;
    schoolId: string| School;
    CVId: string | UploadFile;
    profilePictureId: string | UploadFile;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
