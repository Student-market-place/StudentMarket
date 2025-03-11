"use client";

import { JobsOfferTable } from "@/components/custom-ui/table/JobsOfferTable";
import CompanyOfferService from "@/services/companyOffer.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const OffersCompanyPage = () => {
  const { id } = useParams() as { id: string };

  const query = useQuery({
    queryKey: ["company_offer", id],
    queryFn: async () => {
      const data = await CompanyOfferService.fetchCompanyOffersByCompany(id);
      console.log("Fetched offers:", data);
      return data;
    },
  });

  const offers = query.data;

  return <JobsOfferTable jobOffers={offers || []} />;
};

export default OffersCompanyPage;
