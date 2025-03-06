import { Company } from "@prisma/client";

enum Type {
    STAGE = 'Stage',
    ALTERNANCE = 'Alternance',
}


export interface CompanyOffer {
    id: string;
    companyId: string | Company;
    title: string;
    description: string;
    startDate: Date;
    type: Type;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}