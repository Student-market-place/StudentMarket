/**
 * DTO pour la création d'une entreprise
 */
export interface CreateCompanyDto {
  name: string;
  description: string;
  userId: string;
  profilePictureId?: string | null;
}

/**
 * DTO pour la mise à jour d'une entreprise
 */
export interface UpdateCompanyDto {
  id: string;
  name?: string;
  description?: string;
  profilePictureId?: string | null;
}

/**
 * DTO pour la réponse contenant les données de l'entreprise
 */
export interface CompanyResponseDto {
  id: string;
  name: string;
  description: string;
  userId: string;
  profilePictureId: string | null;
  createdAt: Date;
  modifiedAt: Date;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  profilePicture?: {
    id: string;
    url: string;
  } | null;
}

/**
 * DTO pour la recherche d'entreprises
 */
export interface CompanySearchDto {
  query?: string;
} 