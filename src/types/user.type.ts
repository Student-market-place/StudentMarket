
enum Role {
    ADMIN = 'admin',
    STUDENT = 'student',
    SCHOOL = 'school',
    COMPANY = 'company',
}

export interface User {
    id : string;
    name : string;
    email : string;
    role : Role;
    createdAt : Date;
    updatedAt : Date;
    deletedAt : Date;
}