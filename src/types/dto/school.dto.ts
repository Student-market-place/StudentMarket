/**
 * DTO pour la création d'une école
 */
export interface CreateSchoolDto {
  name: string;
  domainName: string;
  isActive?: boolean;
  profilePictureId: string;
  userId: string;
}

/**
 * DTO pour la mise à jour d'une école
 */
export interface UpdateSchoolDto {
  id: string;
  name?: string;
  domainName?: string;
  isActive?: boolean;
  profilePictureId?: string;
}

/**
 * DTO pour la réponse contenant les données de l'école
 */
export interface SchoolResponseDto {
  id: string;
  name: string;
  domainName: string;
  isActive: boolean;
  profilePictureId: string;
  userId: string;
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
  };
  studentCount?: number;
}

/**
 * DTO pour la recherche d'écoles
 */
export interface SchoolSearchDto {
  isActive?: boolean;
  query?: string;
} 