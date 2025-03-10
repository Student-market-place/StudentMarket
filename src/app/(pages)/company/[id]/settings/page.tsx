"use client";

import CompanyProfilCard from "@/components/custom-ui/CompanyProfileUpdateCard";
import CompanyService from "@/services/company.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const SettingsCompanyPage = () => {
  const { id } = useParams() as { id: string };

  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => CompanyService.fetchCompany(id),
  });

  if (isLoadingCompany || isErrorCompany) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>No data found.</div>;
  }
  return (
    <div>
      <div className="flex justify-center items-center flex-col">
        <CompanyProfilCard key={company.id} company={company} />
      </div>
    </div>
  );
};

export default SettingsCompanyPage;
