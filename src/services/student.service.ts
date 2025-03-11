import {
  GetAllParams,
  StudentWithRelation,
  StudentFormData,
} from "@/types/student.type";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchStudents(
  params: GetAllParams
): Promise<StudentWithRelation[]> {
  const url = `${baseUrl}/api/student`;

  // Construction d'un objet de paramètres de requête
  const queryObject: Record<string, string[]> = {};
  if (params.isAvailable !== undefined) {
    queryObject.available = [params.isAvailable.toString()];
  }
  if (params.status) {
    queryObject.status = [params.status.toString()];
  }
  if (params.skills && params.skills.length > 0) {
    // Axios va sérialiser le tableau en répétant le paramètre dans l'URL
    queryObject.skills = params.skills;
  }
  if (params.userId) {
    queryObject.userId = [params.userId];
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchStudentById(id: string): Promise<StudentWithRelation> {
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.get(url);
  return response.data;
}

async function fetchStudentApplications(id: string) {
  try {
    // Importer dynamiquement le service StudentApplyService
    const { default: StudentApplyService } = await import('./studentApply.service');
    // Utiliser la méthode fetchStudentApplies de ce service
    return await StudentApplyService.fetchStudentApplies(id);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    throw error;
  }
}

interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  status?: string;
  isAvailable?: boolean;
  description?: string;
  skillIds?: string[];
  profilePictureId?: string;
  CVId?: string;
  email?: string;
}

async function updateStudent(
  id: string,
  data: UpdateStudentData
): Promise<StudentWithRelation> {
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.put(url, data);
  return response.data;
}

async function createStudent(
  data: StudentFormData
): Promise<StudentWithRelation> {
  const url = `${baseUrl}/api/student`;

  const response = await axios.post(url, data);
  return response.data;
}

const StudentService = {
  fetchStudents,
  fetchStudentById,
  updateStudent,
  createStudent,
  fetchStudentApplications,
};

export default StudentService;
