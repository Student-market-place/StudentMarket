import axios from "axios";
import { 
  RegisterUserDto, 
  RegisterResponseDto, 
  UpdateRoleDto, 
  SessionEmailResponseDto,
  SessionDto
} from "@/types/dto/auth.dto";
import { AuthUserDto, UserResponseDto } from "@/types/dto/user.dto";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Enregistre un nouvel utilisateur
 * @param data - Données d'enregistrement
 * @returns Réponse d'enregistrement
 */
async function register(data: RegisterUserDto): Promise<RegisterResponseDto> {
  const url = `${baseUrl}/api/auth/register`;
  const response = await axios.post(url, data);
  return response.data;
}

/**
 * Met à jour le rôle d'un utilisateur
 * @param data - Données de mise à jour du rôle
 * @returns Réponse avec les informations de l'utilisateur mis à jour
 */
async function updateRole(data: UpdateRoleDto): Promise<RegisterResponseDto> {
  const url = `${baseUrl}/api/auth/role`;
  const response = await axios.post(url, data);
  return response.data;
}

/**
 * Récupère l'email de la session actuelle
 * @returns Email de l'utilisateur connecté
 */
async function getSessionEmail(): Promise<SessionEmailResponseDto> {
  const url = `${baseUrl}/api/auth/session/email`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Stocke l'email de la session dans un cookie
 * @returns Confirmation de la création du cookie
 */
async function storeSessionEmail(): Promise<SessionEmailResponseDto> {
  const url = `${baseUrl}/api/auth/session/email`;
  const response = await axios.post(url);
  return response.data;
}

/**
 * Récupère la session utilisateur actuelle
 * @returns Informations de session
 */
async function getSession(): Promise<SessionDto | null> {
  const url = `${baseUrl}/api/auth/session`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}

/**
 * Authentifie un utilisateur
 * @param data - Informations d'authentification
 * @returns Réponse d'authentification
 */
async function login(data: AuthUserDto): Promise<UserResponseDto> {
  // Note: Cette fonction dépend de l'implémentation spécifique de NextAuth
  // et pourrait nécessiter des ajustements selon votre configuration
  const url = `${baseUrl}/api/auth/signin`;
  const response = await axios.post(url, data);
  return response.data;
}

/**
 * Déconnecte l'utilisateur actuel
 */
async function logout(): Promise<void> {
  const url = `${baseUrl}/api/auth/signout`;
  await axios.post(url);
}

const AuthService = {
  register,
  updateRole,
  getSessionEmail,
  storeSessionEmail,
  getSession,
  login,
  logout
};

export default AuthService; 