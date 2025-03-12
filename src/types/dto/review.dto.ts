/**
 * DTO pour la création d'un avis
 */
export interface CreateReviewDto {
  studentId: string;
  companyId: string;
  rating: number;
  comment: string;
}

/**
 * DTO pour la mise à jour d'un avis
 */
export interface UpdateReviewDto {
  id: string;
  rating?: number;
  comment?: string;
}

/**
 * DTO pour la réponse contenant les données d'un avis
 */
export interface ReviewResponseDto {
  id: string;
  studentId: string;
  companyId: string;
  rating: number;
  comment: string;
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
 * DTO pour la recherche d'avis
 */
export interface ReviewSearchDto {
  studentId?: string;
  companyId?: string;
  minRating?: number;
  maxRating?: number;
} 