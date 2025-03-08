import { School } from "@/types/school.type";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL || "";

async function fetchSchools(): Promise<School[]> {
  const url = `${baseUrl}api/school`;
  const response = await axios.get(url);
  return response.data;
}

async function fetchSchool(id: string): Promise<School> {
  const url = `${baseUrl}api/school/${id}`;
  const response = await axios.get(url);
  return response.data;
}

async function postSchool(school: School): Promise<School> {
  const url = `${baseUrl}api/school`;
  const response = await axios.post(url, school);
  return response.data;
}

async function putSchool(school: School): Promise<School> {
  const url = `${baseUrl}api/school/${school.id}`;
  const response = await axios.put(url, school);
  return response.data;
}

async function deleteSchool(school: School): Promise<School> {
  const url = `${baseUrl}api/school/${school.id}`;
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
