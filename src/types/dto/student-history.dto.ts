/**
 * DTO pour la création d'un historique étudiant
 */
export interface CreateStudentHistoryDto {
  studentId: string;
  companyId: string;
  startDate: Date;
  endDate?: Date | null;
}

/**
 * DTO pour la mise à jour d'un historique étudiant
 */
export interface UpdateStudentHistoryDto {
  id: string;
  startDate?: Date;
  endDate?: Date | null;
}

/**
 * DTO pour la réponse contenant les données d'un historique étudiant
 */
export interface StudentHistoryResponseDto {
  id: string;
  studentId: string;
  companyId: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureId: string | null;
  };
  company?: {
    id: string;
    name: string;
    profilePictureId: string | null;
  };
}

/**
 * DTO pour la recherche d'historiques étudiant
 */
export interface StudentHistorySearchDto {
  studentId?: string;
  companyId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  isActive?: boolean; // où endDate est null ou endDate est dans le futur
} 