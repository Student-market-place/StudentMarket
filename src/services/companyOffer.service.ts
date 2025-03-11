import {
  CompanyOffer,
  CompanyOfferWithRelation,
  GetAllParams,
} from "@/types/companyOffer.type";
import axios from "axios";

// Utiliser la même base URL pour toutes les requêtes
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchCompanyOffers(
  params: GetAllParams
): Promise<CompanyOfferWithRelation[]> {
  const url = `${baseUrl}/api/company_offer`;

  // Construction d'un objet de paramètres de requête
  const queryObject: Record<string, string[]> = {};
  if (params.status !== undefined) {
    queryObject.status = [params.status.toString()];
  }
  if (params.skills && params.skills.length > 0) {
    // Axios va sérialiser le tableau en répétant le paramètre dans l'URL
    queryObject.skills = params.skills;
  }
  if (params.type) {
    queryObject.type = [params.type];
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchCompanyOffer(id: string): Promise<CompanyOfferWithRelation> {
  const url = `${baseUrl}/api/company_offer/${id}`;
  const response = await axios.get(url);
  return response.data;
}

async function fetchCompanyOffersByCompany(
  companyId: string
): Promise<CompanyOfferWithRelation[]> {
  const url = `${baseUrl}/api/company_offer/company/${companyId}`;
  const response = await axios.get(url);
  return response.data;
}

async function postCompanyOffer(
  companyOffer: CompanyOffer
): Promise<CompanyOffer> {
  const url = `${baseUrl}/api/company_offer`;
  const response = await axios.post(url, companyOffer);
  return response.data;
}

async function putCompanyOffer(
  companyOffer: CompanyOffer
): Promise<CompanyOffer> {
  const url = `${baseUrl}/api/company_offer/${companyOffer.id}`;
  const response = await axios.put(url, companyOffer);
  return response.data;
}

async function deleteCompanyOffer(
  companyOffer: CompanyOffer
): Promise<CompanyOffer> {
  const url = `${baseUrl}/api/company_offer/${companyOffer.id}`;
  const response = await axios.delete(url);
  return response.data;
}

const CompanyOfferService = {
  fetchCompanyOffers,
  fetchCompanyOffer,
  postCompanyOffer,
  putCompanyOffer,
  deleteCompanyOffer,
  fetchCompanyOffersByCompany,
};

export default CompanyOfferService;
