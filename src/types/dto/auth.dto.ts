import { Role } from "@prisma/client";

/**
 * DTO pour l'enregistrement d'un utilisateur
 */
export interface RegisterUserDto {
  email: string;
  role?: Role;
}

/**
 * DTO pour la mise à jour du rôle d'un utilisateur
 */
export interface UpdateRoleDto {
  userId: string;
  role: Role;
}

/**
 * DTO pour la réponse de l'API d'enregistrement
 */
export interface RegisterResponseDto {
  id: string;
  email: string;
  role: Role;
  exists?: boolean;
}

/**
 * DTO pour la session utilisateur
 */
export interface SessionDto {
  user?: {
    id: string;
    name?: string | null;
    email?: string;
    image?: string | null;
    role?: Role;
  };
  expires: string;
}

/**
 * DTO pour la réponse d'email de session
 */
export interface SessionEmailResponseDto {
  email: string;
  success?: boolean;
} 