import { Role } from "@prisma/client";

/**
 * DTO pour la création d'un utilisateur
 */
export interface CreateUserDto {
  name?: string;
  email: string;
  role?: Role;
  password: string;
}

/**
 * DTO pour la mise à jour d'un utilisateur
 */
export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  role?: Role;
  image?: string;
}

/**
 * DTO pour l'authentification d'un utilisateur
 */
export interface AuthUserDto {
  email: string;
  password: string;
}

/**
 * DTO pour la réponse contenant les données de l'utilisateur
 */
export interface UserResponseDto {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
  createdAt: Date;
  studentId?: string;
  companyId?: string;
  schoolId?: string;
} 