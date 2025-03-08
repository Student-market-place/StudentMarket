import { Company, CompanyWithRelation } from "@/types/company.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/company`;

async function fetchCompanies(): Promise<Company[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/company`;

  const response = await axios.get(url);
  return response.data;
}

async function fetchCompany(id: string): Promise<CompanyWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/company/${id}`;

  const response = await axios.get(url);
  return response.data;
}

async function postCompany(company: Company): Promise<Company> {
  const response = await axios.post(END_POINT, company);
  return response.data;
}

interface UpdateCompanyData {
  name: string;
  description: string;
  email?: string;
}

async function putCompany(
  id: string,
  data: UpdateCompanyData
): Promise<CompanyWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/company/${id}`;
  const response = await axios.put(url, data);
  return response.data;
}

async function deleteCompany(company: Company): Promise<Company> {
  const response = await axios.delete(`${END_POINT}/${company.id}`);
  return response.data;
}

const CompanyService = {
  fetchCompanies,
  fetchCompany,
  postCompany,
  putCompany,
  deleteCompany,
};

export default CompanyService;
