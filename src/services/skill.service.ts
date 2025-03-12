import axios from "axios";
import { 
  CreateSkillDto, 
  UpdateSkillDto, 
  SkillResponseDto, 
  SkillSearchDto 
} from "@/types/dto/skill.dto";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Récupère toutes les compétences
 * @returns Liste des compétences
 */
async function fetchSkills(): Promise<SkillResponseDto[]> {
  const url = `${baseUrl}/api/skills`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Recherche des compétences selon divers critères
 * @param searchParams - Paramètres de recherche
 * @returns Liste des compétences correspondantes
 */
async function searchSkills(searchParams: SkillSearchDto): Promise<SkillResponseDto[]> {
  const url = `${baseUrl}/api/skills`;
  
  // Construction des paramètres de requête
  const params: Record<string, string> = {};
  
  if (searchParams.query) {
    params.query = searchParams.query;
  }
  
  if (searchParams.popularWithStudents) {
    params.popularWithStudents = "true";
  }
  
  if (searchParams.popularWithOffers) {
    params.popularWithOffers = "true";
  }
  
  const response = await axios.get(url, { params });
  return response.data;
}

/**
 * Récupère une compétence spécifique
 * @param id - ID de la compétence
 * @returns Détails de la compétence
 */
async function fetchSkill(id: string): Promise<SkillResponseDto> {
  const url = `${baseUrl}/api/skill/${id}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Crée une nouvelle compétence
 * @param skill - Données de la compétence à créer
 * @returns La compétence créée
 */
async function createSkill(skill: CreateSkillDto): Promise<SkillResponseDto> {
  const url = `${baseUrl}/api/skills`;
  const response = await axios.post(url, skill);
  return response.data;
}

/**
 * Met à jour une compétence
 * @param skill - Données de mise à jour
 * @returns La compétence mise à jour
 */
async function updateSkill(skill: UpdateSkillDto): Promise<SkillResponseDto> {
  if (!skill.id) {
    throw new Error("ID de la compétence est requis pour la mise à jour");
  }
  
  const url = `${baseUrl}/api/skill/${skill.id}`;
  const response = await axios.put(url, skill);
  return response.data;
}

/**
 * Supprime une compétence
 * @param id - ID de la compétence
 * @returns La compétence supprimée
 */
async function deleteSkill(id: string): Promise<SkillResponseDto> {
  const url = `${baseUrl}/api/skill/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

const SkillService = {
  fetchSkills,
  searchSkills,
  fetchSkill,
  createSkill,
  updateSkill,
  deleteSkill,
};

export default SkillService;
