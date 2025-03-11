import { Student, Company_offer } from "@prisma/client";
export interface StudentApply {
  id: string;
  studentId: string | Student;
  companyOfferId: string | Company_offer;
  status: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  companyOffer: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    companyId: string;
    endDate: string;
    startDate: string;
    company: {
      id: string;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
      userId: string;
    };
  };
}
