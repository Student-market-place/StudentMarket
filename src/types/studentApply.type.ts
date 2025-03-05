import { Student, Company_offer } from "@prisma/client";
export interface StudentApply {
    id: string;
    studentId: string | Student;
    companyOfferId: string |Company_offer;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
