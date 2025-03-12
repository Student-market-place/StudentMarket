import { Apply_Status } from "@prisma/client";

/**
 * DTO pour la création d'une candidature étudiant
 */
export interface CreateStudentApplyDto {
  studentId: string;
  companyOfferId: string;
  message: string;
  status?: Apply_Status;
}

/**
 * DTO pour la mise à jour d'une candidature étudiant
 */
export interface UpdateStudentApplyDto {
  id: string;
  message?: string;
  status?: Apply_Status;
}

/**
 * DTO pour la réponse contenant les données d'une candidature étudiant
 */
export interface StudentApplyResponseDto {
  id: string;
  studentId: string;
  companyOfferId: string;
  message: string;
  status: Apply_Status;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureId: string | null;
  };
  companyOffer?: {
    id: string;
    title: string;
    companyId: string;
    company?: {
      id: string;
      name: string;
    };
  };
}

/**
 * DTO pour la recherche de candidatures étudiant
 */
export interface StudentApplySearchDto {
  studentId?: string;
  companyOfferId?: string;
  companyId?: string;
  status?: Apply_Status;
} 