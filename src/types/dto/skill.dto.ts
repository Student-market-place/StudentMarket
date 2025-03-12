/**
 * DTO pour la création d'une compétence
 */
export interface CreateSkillDto {
  name: string;
}

/**
 * DTO pour la mise à jour d'une compétence
 */
export interface UpdateSkillDto {
  id: string;
  name?: string;
}

/**
 * DTO pour la réponse contenant les données d'une compétence
 */
export interface SkillResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
  studentCount?: number;
  offerCount?: number;
}

/**
 * DTO pour la recherche de compétences
 */
export interface SkillSearchDto {
  query?: string;
  popularWithStudents?: boolean; // trier par nombre d'étudiants
  popularWithOffers?: boolean; // trier par nombre d'offres
} 