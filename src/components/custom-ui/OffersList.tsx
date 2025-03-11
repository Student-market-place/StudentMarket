"use client";

import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CardJobOffer from "./CardOffer";
import { useEffect } from "react";

const OffersList = () => {
  const searchParams = useSearchParams();
  
  // Récupérer les paramètres de filtrage depuis l'URL
  const offerStatus = searchParams.get("status");
  const offerType = searchParams.get("type");
  const skillId = searchParams.get("skills");
  
  // Construire l'URL de l'API avec les paramètres de filtrage
  const getApiUrl = () => {
    const params = new URLSearchParams();
    
    if (offerStatus) params.append("status", offerStatus);
    if (offerType) params.append("type", offerType);
    if (skillId) params.append("skills", skillId);
    
    const queryString = params.toString();
    return `/api/company_offer/filter${queryString ? `?${queryString}` : ''}`;
  };
  
  const { data: offers, refetch } = useQuery({
    queryKey: ["company_offers", offerStatus, offerType, skillId],
    queryFn: async () => {
      const response = await fetch(getApiUrl());
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des offres");
      }
      return await response.json();
    },
  });
  
  // Rafraîchir les données lorsque les paramètres de filtrage changent
  useEffect(() => {
    refetch();
  }, [offerStatus, offerType, skillId, refetch]);

  if (!offers) {
    return <div>Chargement...</div>;
  }

  if (offers.length === 0) {
    return <div className="col-span-4 text-center py-8">Aucune offre trouvée</div>;
  }

  return (
    <>
      {offers.map((offer: CompanyOfferWithRelation) => (
        <CardJobOffer key={offer.id} jobOffer={offer} />
      ))}
    </>
  );
};

export default OffersList;
