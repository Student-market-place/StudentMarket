import {
  Company,
  CompanyFormData,
  CompanyWithRelation,
} from "@/types/company.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/company`;

async function fetchCompanies(): Promise<CompanyWithRelation[]> {
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

async function createCompany(
  companyFormData: CompanyFormData
): Promise<Company> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/company`;

  const response = await axios.post(url, companyFormData);
  return response.data;
}

interface UpdateCompanyData {
  name?: string;
  description?: string;
  email?: string;
  profilePictureId?: string;
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
  createCompany,
  putCompany,
  deleteCompany,
};

export default CompanyService;
