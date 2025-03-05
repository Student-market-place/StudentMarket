
enum Status {
    STAGIAIRE = 'Stagiaire',
    ALTERNANT = 'Alternant',
}


export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    status: Status;
    description: string;
    isAvailable: boolean;
    userId: string;
    schoolId: string;
    CVId: string;
    profilePictureId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
