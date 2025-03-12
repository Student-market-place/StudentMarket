import {
  GetAllParams,
  StudentWithRelation,
  StudentFormData,
} from "@/types/student.type";
import { 
  StudentResponseDto,
  CreateStudentDto,
  UpdateStudentDto,
  StudentSearchDto
} from "@/types/dto/student.dto";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchStudents(
  params: StudentSearchDto
): Promise<StudentResponseDto[]> {
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
  if (params.schoolId) {
    queryObject.schoolId = [params.schoolId];
  }
  if (params.query) {
    queryObject.query = [params.query];
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchStudentById(id: string): Promise<StudentResponseDto> {
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

async function updateStudent(
  id: string,
  data: UpdateStudentDto
): Promise<StudentResponseDto> {
  const url = `${baseUrl}/api/student/${id}`;
  console.log("URL de l'API:", url);
  console.log("Données envoyées:", data);

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error: any) {
    console.error("Erreur API:", error.response?.data);
    throw error;
  }
}

async function createStudent(
  data: CreateStudentDto
): Promise<StudentResponseDto> {
  const url = `${baseUrl}/api/student`;

  const response = await axios.post(url, data);
  return response.data;
}

async function deleteStudent(id: string): Promise<StudentWithRelation> {
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.delete(url);
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
