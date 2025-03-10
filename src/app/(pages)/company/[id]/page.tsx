"use client";
import CardJobOffer from "@/components/custom-ui/CardOffer";
import CompanyProfilCard from "@/components/custom-ui/CompanyProfileUpdateCard";
import CompanyService from "@/services/company.service";
import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const CompanyPublicPage = () => {
  const { id } = useParams() as { id: string };

  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => CompanyService.fetchCompany(id),
  });

  const query = useQuery({
    queryKey: ["company_offer", id],
    queryFn: async () => {
      const data = await CompanyOfferService.fetchCompanyOffersByCompany(id);
      console.log("Fetched offers:", data);
      return data;
    },
  });

  if (isLoadingCompany || isErrorCompany) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>No data found.</div>;
  }

  const offers = query.data;

  return (
    <div className="flex items-start justify-center gap-30 p-8">
      <CompanyProfilCard key={company.id} company={company} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center">
          <h1>Offres publiées</h1>
        </div>
        {offers?.map((offer: CompanyOfferWithRelation) => (
          <CardJobOffer key={offer.id} jobOffer={offer} />
        ))}
      </div>
    </div>
  );
};

export default CompanyPublicPage;
