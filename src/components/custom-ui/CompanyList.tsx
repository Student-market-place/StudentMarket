"use client";

import { CompanyWithRelation } from "@/types/company.type";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CardCompany from "./CardCompany";
import { useEffect } from "react";

// Composant wrapper qui utilise useSearchParams
const CompanyList = () => {
  const searchParams = useSearchParams();

  // Récupérer les paramètres de filtrage depuis l'URL
  const companyName = searchParams.get("name");

  return <CompanyListContent companyName={companyName} />;
};

// Composant de contenu qui ne dépend pas directement de useSearchParams
const CompanyListContent = ({
  companyName,
}: {
  companyName: string | null;
}) => {
  // Construire l'URL de l'API avec les paramètres de filtrage
  const getApiUrl = () => {
    const params = new URLSearchParams();

    if (companyName) params.append("name", companyName);

    const queryString = params.toString();
    return `/api/company/filter${queryString ? `?${queryString}` : ""}`;
  };

  const { data: companies, refetch } = useQuery({
    queryKey: ["companies", companyName],
    queryFn: async () => {
      const response = await fetch(getApiUrl());
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des entreprises");
      }
      return await response.json();
    },
  });

  // Rafraîchir les données lorsque les paramètres de filtrage changent
  useEffect(() => {
    refetch();
  }, [companyName, refetch]);

  if (!companies) {
    return <div>Chargement...</div>;
  }

  if (companies.length === 0) {
    return (
      <div className="col-span-4 text-center py-8">
        Aucune entreprise trouvée
      </div>
    );
  }

  return (
    <>
      {companies.map((company: CompanyWithRelation) => (
        <CardCompany key={company.id} company={company} />
      ))}
    </>
  );
};

export default CompanyList;
