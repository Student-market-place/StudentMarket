"use client";

import CompanyProfileCard from "@/components/custom-ui/CompanyProfileUpdateCard";
import CompanyService from "@/services/company.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import CompanyUpdateForm from "@/components/custom-ui/CompanyUpdateForm";

const CompanyUpdateProfile = () => {
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
    <div className="py-2 gap-x-28 flex justify-center items-center ">
      <CompanyProfileCard key={company.id} company={company} />
      <CompanyUpdateForm company={company} />
    </div>
  );
};

export default CompanyUpdateProfile;
