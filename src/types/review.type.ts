
export interface Review {
    id: string;
    rating: number;
    comment: string;
    companyId: string;
    studentId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}