import { Company, EnumStatusTYpe, Prisma } from "@prisma/client";

export enum Type {
  STAGE = "Stage",
  ALTERNANCE = "Alternance",
}

export enum Status {
  OPEN = "Open",
  CLOSED = "Closed",
}

export interface CompanyOffer {
  id: string;
  companyId: string | Company;
  title: string;
  description: string;
  startDate: Date;
  status: Status;
  type: Type;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  skills: string[];
  studentApplies: string[];
}

export interface GetAllParams {
  companyId?: string;
  status?: Status;
  type?: EnumStatusTYpe;
  skills?: string[];
  studentApplies?: string[];
}

export type CompanyOfferWithRelation = Prisma.Company_offerGetPayload<{
  include: {
    company: true;
    skills: true;
    studentApplies: true;
  };
}>;
