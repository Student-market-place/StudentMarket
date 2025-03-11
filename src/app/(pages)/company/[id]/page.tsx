"use client";
import CardJobOffer from "@/components/custom-ui/CardOffer";
import CompanyProfilCard from "@/components/custom-ui/CompanyProfileUpdateCard";
import { Button } from "@/components/ui/button";
import CompanyService from "@/services/company.service";
import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const CompanyPublicPage = () => {
  const { id } = useParams() as { id: string };
  const [isOwner, setIsOwner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => CompanyService.fetchCompany(id),
  });

  // S'assurer que le code s'exécute seulement côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Vérifier si l'utilisateur est le propriétaire de l'entreprise
  useEffect(() => {
    if (!isClient || !company) return;

    try {
      const userId = localStorage.getItem('userId');
      console.log("🔍 Vérification du propriétaire - UserId:", userId);
      console.log("🔍 Entreprise - OwnerId:", company.userId);
      
      if (userId && userId === company.userId) {
        console.log("✅ L'utilisateur est le propriétaire");
        setIsOwner(true);
      } else {
        console.log("❌ L'utilisateur n'est pas le propriétaire");
        setIsOwner(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du propriétaire:", error);
      setIsOwner(false);
    }
  }, [company, isClient]);

  const query = useQuery({
    queryKey: ["company_offer", id],
    queryFn: async () => {
      const data = await CompanyOfferService.fetchCompanyOffersByCompany(id);
      console.log("Fetched offers:", data);
      return data;
    },
  });

  if (isLoadingCompany || isErrorCompany) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
        <div className="animate-pulse bg-gray-200 rounded-xl w-full max-w-md h-32 flex items-center justify-center">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 w-full max-w-md">
          <p className="text-red-600 text-center">Entreprise non trouvée</p>
        </div>
      </div>
    );
  }

  const offers = query.data;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Profil et bouton contacter */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 items-center">
          <CompanyProfilCard key={company.id} company={company} />
          <a href={`mailto:${company.user.email}`} className="w-full">
            <Button className="w-full">Contacter</Button>
          </a>
          {isOwner && (
            <Link href={`/company/${id}/create-offer`} className="w-full">
              <Button className="w-full">Créer une offre</Button>
            </Link>
          )}
        </div>
        
        {/* Liste des offres */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4">
          <div className="flex justify-center items-center mb-2 md:mb-4">
            <h1 className="text-xl md:text-2xl font-semibold">Offres publiées</h1>
          </div>
          
          {offers && offers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offers.map((offer: CompanyOfferWithRelation) => (
                <CardJobOffer key={offer.id} jobOffer={offer} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Aucune offre publiée pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicPage;
