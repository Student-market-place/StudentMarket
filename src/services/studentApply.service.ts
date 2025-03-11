import axios from "axios";
import { Apply_Status } from "@prisma/client";
import { StudentWithRelation } from "@/types/student.type";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";

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
  student?: StudentWithRelation; // Type plus précis selon votre besoin
  companyOffer?: CompanyOfferWithRelation; // Type plus précis selon votre besoin
}

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/student_apply`;

/**
 * Récupère toutes les candidatures d'un étudiant
 * @param studentId - ID de l'étudiant
 * @returns Liste des candidatures
 */
async function fetchStudentApplies(
  studentId: string
): Promise<StudentApplyWithRelations[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student_apply/student/${studentId}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Récupère une candidature spécifique
 * @param id - ID de la candidature
 * @returns Détails de la candidature
 */
async function fetchStudentApply(
  id: string
): Promise<StudentApplyWithRelations> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

/**
 * Récupère toutes les candidatures pour une offre d'entreprise
 * @param companyOfferId - ID de l'offre
 * @returns Liste des candidatures
 */
async function fetchCompanyOfferApplies(
  companyOfferId: string
): Promise<StudentApplyWithRelations[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student_apply/offer/${companyOfferId}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Crée une nouvelle candidature
 * @param data - Données de la candidature
 * @returns La candidature créée
 */
async function createStudentApply(
  data: CreateStudentApplyData
): Promise<StudentApplyWithRelations> {
  const response = await axios.post(END_POINT, data);
  return response.data;
}

/**
 * Met à jour le statut d'une candidature
 * @param id - ID de la candidature
 * @param status - Nouveau statut
 * @returns La candidature mise à jour
 */
async function updateStudentApplyStatus(
  id: string,
  status: Apply_Status
): Promise<StudentApplyWithRelations> {
  const response = await axios.patch(`${END_POINT}/${id}/status`, { status });
  return response.data;
}

/**
 * Supprime une candidature
 * @param id - ID de la candidature
 * @returns La candidature supprimée
 */
async function deleteStudentApply(
  id: string
): Promise<StudentApplyWithRelations> {
  const response = await axios.delete(`${END_POINT}/${id}`);
  return response.data;
}

const StudentApplyService = {
  fetchStudentApplies,
  fetchStudentApply,
  fetchCompanyOfferApplies,
  createStudentApply,
  updateStudentApplyStatus,
  deleteStudentApply,
};

export default StudentApplyService;
