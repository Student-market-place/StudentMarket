import { EnumStatusTYpe, OfferStatus } from "@prisma/client";

/**
 * DTO pour la création d'une offre d'entreprise
 */
export interface CreateCompanyOfferDto {
  companyId: string;
  title: string;
  description: string;
  expectedSkills: string;
  startDate: Date;
  type: EnumStatusTYpe;
  status?: OfferStatus;
  skills?: string[];
}

/**
 * DTO pour la mise à jour d'une offre d'entreprise
 */
export interface UpdateCompanyOfferDto {
  id: string;
  title?: string;
  description?: string;
  expectedSkills?: string;
  startDate?: Date;
  type?: EnumStatusTYpe;
  status?: OfferStatus;
  skills?: string[];
}

/**
 * DTO pour la réponse contenant les données d'une offre d'entreprise
 */
export interface CompanyOfferResponseDto {
  id: string;
  companyId: string;
  title: string;
  description: string;
  expectedSkills: string;
  startDate: Date;
  type: EnumStatusTYpe;
  status: OfferStatus;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date | null;
  company?: {
    id: string;
    name: string;
    profilePictureId: string | null;
  };
  skills?: {
    id: string;
    name: string;
  }[];
  studentAppliesCount?: number;
}

/**
 * DTO pour la recherche d'offres d'entreprise
 */
export interface CompanyOfferSearchDto {
  companyId?: string;
  type?: EnumStatusTYpe;
  status?: OfferStatus;
  skills?: string[];
  query?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
} 