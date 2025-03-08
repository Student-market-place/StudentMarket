import axios from "axios";
import { School } from "@prisma/client";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/students`;

async function fetchSchools(): Promise<School[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/school`;

  const response = await axios.get(url);
  return response.data;
}

async function fetchSchool(id: string): Promise<School> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
} 

async function postSchool(school: School): Promise<School> {
  const response = await axios.post(END_POINT, school);
  return response.data;
}

async function putSchool(school: School): Promise<School> {
  const response = await axios.put(`${END_POINT}/${school.id}`, school);
  return response.data;
}

async function deleteSchool(school: School): Promise<School> {
  const response = await axios.delete(`${END_POINT}/${school.id}`);
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