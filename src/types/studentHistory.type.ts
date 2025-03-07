import { Student, Company } from "@prisma/client";
export interface StudentHistoryRelation {
    id: string;
    studentId: Student | string;
    companyId: Company | string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}