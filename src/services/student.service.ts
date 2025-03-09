import {
  GetAllParams,
  StudentWithRelation,
  StudentFormData,
} from "@/types/student.type";
import axios from "axios";

async function fetchStudents(
  params: GetAllParams
): Promise<StudentWithRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
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

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchStudentById(id: string): Promise<StudentWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.get(url);
  return response.data;
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
}

async function updateStudent(
  id: string,
  data: UpdateStudentData
): Promise<StudentWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.put(url, data);
  return response.data;
}

async function createStudent(
  data: StudentFormData
): Promise<StudentWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student`;

  const response = await axios.post(url, data);
  return response.data;
}

const StudentService = {
  fetchStudents,
  fetchStudentById,
  updateStudent,
  createStudent,
};

export default StudentService;
