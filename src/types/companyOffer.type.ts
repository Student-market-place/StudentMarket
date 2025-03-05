
enum Type {
    STAGE = 'Stage',
    ALTERNANCE = 'Alternance',
}


export interface CompanyOffer {
    id: string;
    companyId: string;
    title: string;
    description: string;
    expectedSkills: string[];
    startDate: Date;
    type: Type;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}