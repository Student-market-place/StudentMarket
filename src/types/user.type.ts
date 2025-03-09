import { Company, School, Student, User } from "@prisma/client";

export interface UserWithRelations extends User {
  student?: (Student & {
    profilePicture?: {
      url: string;
    } | null;
  }) | null;
  company?: (Company & {
    profilePicture?: {
      url: string;
    } | null;
  }) | null;
  school?: (School & {
    profilePicture?: {
      url: string;
    } | null;
  }) | null;
} 