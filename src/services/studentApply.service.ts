import axios from "axios";
import { Apply_Status } from "@prisma/client";
import { 
  CreateStudentApplyDto, 
  UpdateStudentApplyDto, 
  StudentApplyResponseDto, 
  StudentApplySearchDto 
} from "@/types/dto/student-apply.dto";

// Type pour la création d'une candidature
interface CreateStudentApplyData {
  studentId: string;
  companyOfferId: string;
  message: string;
  status: string;
}

// Type pour une candidature avec relations
export interface StudentApplyWithRelations {
  id: string;
  studentId: string;
  companyOfferId: string;
  message: string;
  status: Apply_Status;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt?: Date;
  student?: any; // Type plus précis selon votre besoin
  companyOffer?: any; // Type plus précis selon votre besoin
}

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/student_apply`;
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Récupère toutes les candidatures d'un étudiant
 * @param studentId - ID de l'étudiant
 * @returns Liste des candidatures
 */
async function fetchStudentApplies(studentId: string): Promise<StudentApplyResponseDto[]> {
  const url = `${baseUrl}/api/student_apply/student/${studentId}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Récupère une candidature spécifique
 * @param id - ID de la candidature
 * @returns Détails de la candidature
 */
async function fetchStudentApply(id: string): Promise<StudentApplyResponseDto> {
  const url = `${baseUrl}/api/student_apply/${id}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Récupère toutes les candidatures pour une offre d'entreprise
 * @param companyOfferId - ID de l'offre
 * @returns Liste des candidatures
 */
async function fetchCompanyOfferApplies(companyOfferId: string): Promise<StudentApplyResponseDto[]> {
  const url = `${baseUrl}/api/student_apply/offer/${companyOfferId}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Recherche des candidatures selon divers critères
 * @param searchParams - Paramètres de recherche
 * @returns Liste des candidatures correspondantes
 */
async function searchStudentApplies(searchParams: StudentApplySearchDto): Promise<StudentApplyResponseDto[]> {
  const url = `${baseUrl}/api/student_apply`;
  
  // Construction des paramètres de requête
  const params: Record<string, string> = {};
  
  if (searchParams.studentId) {
    params.studentId = searchParams.studentId;
  }
  
  if (searchParams.companyOfferId) {
    params.companyOfferId = searchParams.companyOfferId;
  }
  
  if (searchParams.companyId) {
    params.companyId = searchParams.companyId;
  }
  
  if (searchParams.status) {
    params.status = searchParams.status;
  }
  
  const response = await axios.get(url, { params });
  return response.data;
}

/**
 * Crée une nouvelle candidature
 * @param data - Données de la candidature
 * @returns La candidature créée
 */
async function createStudentApply(data: CreateStudentApplyDto): Promise<StudentApplyResponseDto> {
  const url = `${baseUrl}/api/student_apply`;
  const response = await axios.post(url, data);
  return response.data;
}

/**
 * Met à jour le statut d'une candidature
 * @param id - ID de la candidature
 * @param status - Nouveau statut
 * @returns La candidature mise à jour
 */
async function updateStudentApplyStatus(id: string, status: Apply_Status): Promise<StudentApplyResponseDto> {
  const url = `${baseUrl}/api/student_apply/${id}/status`;
  const response = await axios.patch(url, { status });
  return response.data;
}

/**
 * Met à jour une candidature
 * @param data - Données de mise à jour
 * @returns La candidature mise à jour
 */
async function updateStudentApply(data: UpdateStudentApplyDto): Promise<StudentApplyResponseDto> {
  if (!data.id) {
    throw new Error("ID de la candidature est requis pour la mise à jour");
  }
  
  const url = `${baseUrl}/api/student_apply/${data.id}`;
  const response = await axios.put(url, data);
  return response.data;
}

/**
 * Supprime une candidature
 * @param id - ID de la candidature
 * @returns La candidature supprimée
 */
async function deleteStudentApply(id: string): Promise<StudentApplyResponseDto> {
  const url = `${baseUrl}/api/student_apply/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

const StudentApplyService = {
  fetchStudentApplies,
  fetchStudentApply,
  fetchCompanyOfferApplies,
  searchStudentApplies,
  createStudentApply,
  updateStudentApplyStatus,
  updateStudentApply,
  deleteStudentApply,
};

export default StudentApplyService;
