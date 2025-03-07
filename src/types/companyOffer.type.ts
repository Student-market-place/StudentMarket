import { Company } from "@prisma/client";

enum Type {
    STAGE = 'Stage',
    ALTERNANCE = 'Alternance',
}

enum Status {
    OPEN = 'Open',
    CLOSED = 'Closed',
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
}