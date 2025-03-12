import { EnumStatusTYpe } from "@prisma/client";

/**
 * DTO pour la création d'un étudiant
 */
export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  status: EnumStatusTYpe;
  description: string;
  isAvailable?: boolean;
  userId: string;
  schoolId: string;
  skills?: string[];
}

/**
 * DTO pour la mise à jour d'un étudiant
 */
export interface UpdateStudentDto {
  id: string;
  firstName?: string;
  lastName?: string;
  status?: EnumStatusTYpe;
  description?: string;
  isAvailable?: boolean;
  schoolId?: string;
  CVId?: string | null;
  profilePictureId?: string | null;
  skills?: string[];
}

/**
 * DTO pour la réponse contenant les données de l'étudiant
 */
export interface StudentResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  status: EnumStatusTYpe;
  description: string;
  isAvailable: boolean;
  userId: string;
  schoolId: string;
  CVId: string | null;
  profilePictureId: string | null;
  createdAt: Date;
  school?: {
    id: string;
    name: string;
  };
  skills?: {
    id: string;
    name: string;
  }[];
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  profilePicture?: {
    id: string;
    url: string;
  };
  CV?: {
    id: string;
    url: string;
  };
}

/**
 * DTO pour la recherche d'étudiants
 */
export interface StudentSearchDto {
  status?: EnumStatusTYpe;
  schoolId?: string;
  isAvailable?: boolean;
  skills?: string[];
  query?: string;
  userId?: string;
} 