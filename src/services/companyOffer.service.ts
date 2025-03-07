import { CompanyOffer } from "@/types/companyOffer.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/company_offer`;

async function fetchCompanyOffers(params: CompanyOffer): Promise<CompanyOffer[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/company_offer`;

    // Construction d'un objet de paramètres de requête
    const queryObject: Record<string, string> = {};
    if (params.status !== undefined) {
      queryObject.status = params.status;
    }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchCompanyOffer(id: string): Promise<CompanyOffer> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

async function postCompanyOffer(companyOffer: CompanyOffer): Promise<CompanyOffer> {
  const response = await axios.post(END_POINT, companyOffer);
  return response.data;
}

async function putCompanyOffer(companyOffer: CompanyOffer): Promise<CompanyOffer> {
  const response = await axios.put(`${END_POINT}/${companyOffer.id}`, companyOffer);
  return response.data;
}

async function deleteCompanyOffer(companyOffer: CompanyOffer): Promise<CompanyOffer> {
  const response = await axios.delete(`${END_POINT}/${companyOffer.id}`);
  return response.data;
}

const CompanyOfferService = {
  fetchCompanyOffers,
  fetchCompanyOffer,
  postCompanyOffer,
  putCompanyOffer,
  deleteCompanyOffer,
};

export default CompanyOfferService;
