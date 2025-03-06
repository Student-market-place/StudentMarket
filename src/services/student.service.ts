import {
  GetAllParams,
  Student,
  StudentWithRelation,
} from "@/types/student.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/students`;

async function fetchStudents(
  params: GetAllParams
): Promise<StudentWithRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student`;

  // Construction d'un objet de paramètres de requête
  const queryObject: Record<string, any> = {};
  if (params.isAvailable !== undefined) {
    queryObject.available = params.isAvailable.toString();
  }
  if (params.status) {
    queryObject.status = params.status;
  }
  if (params.skills && params.skills.length > 0) {
    // Axios va sérialiser le tableau en répétant le paramètre dans l'URL
    queryObject.skills = params.skills;
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

const StudentService = {
  fetchStudents,
};

export default StudentService;
