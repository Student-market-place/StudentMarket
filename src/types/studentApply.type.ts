import { Student, Company_offer } from "@prisma/client";
export interface StudentApply {
    id: string;
    studentId: string | Student;
    companyOfferId: string |Company_offer;
    status: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
