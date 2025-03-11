import axios from "axios";
import { School, SchoolWithRelations } from "@/types/school.type";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchSchools(): Promise<SchoolWithRelations[]> {
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

async function fetchSchool(id: string): Promise<School> {
  const url = `${baseUrl}/api/school/${id}`;
  const response = await axios.get(url);
  return response.data;
}

interface CreateSchoolData {
  name: string;
  domainName: string;
  isActive?: boolean;
  email?: string;
}

async function postSchool(data: CreateSchoolData): Promise<School> {
  const url = `${baseUrl}/api/school`;
  const response = await axios.post(url, data);
  return response.data;
}

interface UpdateSchoolData {
  name?: string;
  domainName?: string;
  isActive?: boolean;
  email?: string;
  profilePictureId?: string;
}

async function putSchool(id: string, data: UpdateSchoolData): Promise<School> {
  const url = `${baseUrl}/api/school/${id}`;
  const response = await axios.put(url, data);
  return response.data;
}

async function deleteSchool(school: School): Promise<School> {
  const url = `${baseUrl}/api/school/${school.id}`;
  const response = await axios.delete(url);
  return response.data;
}

const SchoolService = {
  fetchSchools,
  fetchSchool,
  postSchool,
  putSchool,
  deleteSchool,
};

export default SchoolService;
