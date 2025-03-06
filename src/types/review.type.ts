import { Company, Student } from "@prisma/client";
export interface Review {
    id: string;
    rating: number;
    comment: string;
    companyId: string | Company;
    studentId: string | Student;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}