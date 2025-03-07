import { Student, Company, Prisma } from "@prisma/client";
export interface StudentHistory {
  id: string;
  studentId: Student | string;
  companyId: Company | string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface GetAllParams {
  companyId?: string;
  studentId?: string;
  startDate?: Date;
  endDate?: Date;
}

export type HistoryWithRelation = Prisma.Student_historyGetPayload<{
  include: {
    company: true;
    student: true;
  };
}>;
