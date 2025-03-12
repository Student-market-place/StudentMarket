/**
 * DTO pour la création d'un fichier uploadé
 */
export interface CreateUploadFileDto {
  url: string;
}

/**
 * DTO pour la mise à jour d'un fichier uploadé
 */
export interface UpdateUploadFileDto {
  id: string;
  url?: string;
}

/**
 * DTO pour la réponse contenant les données d'un fichier uploadé
 */
export interface UploadFileResponseDto {
  id: string;
  url: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
  type?: string; // déterminé par l'extension du fichier
  size?: number; // en octets
} 