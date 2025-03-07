import { Company, Prisma, Student } from "@prisma/client";
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

export interface GetAllParams {
  companyId?: string;
  studentId?: string;
  comment?: string;
  rating?: number;
}

export type ReviewWithRelation = Prisma.ReviewGetPayload<{
  include: {
    company: true;
    student: true;
  };
}>;
