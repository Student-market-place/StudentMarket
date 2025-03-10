import { Company, EnumStatusTYpe, Prisma } from "@prisma/client";

enum Type {
  STAGE = "Stage",
  ALTERNANCE = "Alternance",
}

enum Status {
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
}

export interface GetAllParams {
  companyId?: string;
  status?: Status;
  type?: EnumStatusTYpe;
  skills?: string[];
}

export type CompanyOfferWithRelation = Prisma.Company_offerGetPayload<{
  include: {
    company: true;
    skills: true;
  };
}>;
