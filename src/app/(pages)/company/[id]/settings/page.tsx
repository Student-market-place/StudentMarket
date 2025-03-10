"use client";

import CompanyProfilCard from "@/components/custom-ui/CompanyProfileUpdateCard";
import { Button } from "@/components/ui/button";
import CompanyService from "@/services/company.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
    <div className="flex flex-col p-8">
      <div className="flex justify-center items-center flex-col">
        <CompanyProfilCard key={company.id} company={company} />
        <div className="flex gap-4 mt-4">
          <Link href={`/company/${id}/update`}>
            <Button>Modifier le profil</Button>
          </Link>
          <Link href={`/company/${id}/offers`}>
            <Button>Mes offres</Button>
          </Link>
          <Button>Candidatures reçues</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCompanyPage;
