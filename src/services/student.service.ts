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

async function fetchStudentById(id: string): Promise<StudentWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student/${id}`;

  const response = await axios.get(url);
  return response.data;
}

async function downloadCV(cvId: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/download?cvId=${cvId}`; // Assurez-vous que votre API est configurée pour accepter cette requête.

  try {
    const response = await axios.get(url, {
      responseType: "blob", // Important pour télécharger le fichier en tant que binaire
    });

    // Crée un lien pour télécharger le fichier
    const blob = response.data;
    const urlObject = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObject;
    a.download = "CV.pdf"; // Vous pouvez modifier ce nom si nécessaire
    a.click();
    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier : ", error);
  }
}

const StudentService = {
  fetchStudents,
  fetchStudentById,
  downloadCV,
};

export default StudentService;
