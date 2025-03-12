import axios from "axios";
import { 
  CreateSchoolDto, 
  UpdateSchoolDto, 
  SchoolResponseDto, 
  SchoolSearchDto 
} from "@/types/dto/school.dto";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Récupère toutes les écoles
 * @returns Liste des écoles
 */
async function fetchSchools(): Promise<SchoolResponseDto[]> {
  const url = `${baseUrl}/api/school`;
  console.log("Fetching schools from URL:", url);
  try {
    const response = await axios.get(url);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchSchools:", error);
    throw error;
  }
}

/**
 * Recherche des écoles selon divers critères
 * @param searchParams - Paramètres de recherche
 * @returns Liste des écoles correspondantes
 */
async function searchSchools(searchParams: SchoolSearchDto): Promise<SchoolResponseDto[]> {
  const url = `${baseUrl}/api/school`;
  
  // Construction des paramètres de requête
  const params: Record<string, string> = {};
  
  if (searchParams.isActive !== undefined) {
    params.isActive = searchParams.isActive.toString();
  }
  
  if (searchParams.query) {
    params.query = searchParams.query;
  }
  
  const response = await axios.get(url, { params });
  return response.data;
}

/**
 * Récupère une école spécifique
 * @param id - ID de l'école
 * @returns Détails de l'école
 */
async function fetchSchool(id: string): Promise<SchoolResponseDto> {
  const url = `${baseUrl}/api/school/${id}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Interface pour la création d'une école (version client)
 */
interface CreateSchoolClientData {
  name: string;
  domainName: string;
  isActive?: boolean;
  email: string;
}

/**
 * Crée une nouvelle école
 * @param data - Données de l'école à créer
 * @returns L'école créée
 */
async function createSchool(data: CreateSchoolClientData): Promise<SchoolResponseDto> {
  const url = `${baseUrl}/api/school`;
  const response = await axios.post(url, data);
  return response.data;
}

/**
 * Interface pour la mise à jour d'une école (version client)
 */
interface UpdateSchoolClientData {
  name?: string;
  domainName?: string;
  isActive?: boolean;
  email?: string;
  profilePictureId?: string;
}

/**
 * Met à jour une école
 * @param id - ID de l'école
 * @param data - Données de mise à jour
 * @returns L'école mise à jour
 */
async function updateSchool(id: string, data: UpdateSchoolClientData): Promise<SchoolResponseDto> {
  const url = `${baseUrl}/api/school/${id}`;
  const response = await axios.put(url, data);
  return response.data;
}

/**
 * Supprime une école
 * @param id - ID de l'école
 * @returns L'école supprimée
 */
async function deleteSchool(id: string): Promise<SchoolResponseDto> {
  const url = `${baseUrl}/api/school/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

const SchoolService = {
  fetchSchools,
  searchSchools,
  fetchSchool,
  createSchool,
  updateSchool,
  deleteSchool,
};

export default SchoolService;
