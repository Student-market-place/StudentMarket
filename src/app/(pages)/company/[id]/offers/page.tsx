"use client";

import { JobsOfferTable } from "@/components/custom-ui/table/JobsOfferTable";
import CompanyOfferService from "@/services/companyOffer.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const OffersCompanyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["company_offer", id],
    queryFn: async () => {
      const data = await CompanyOfferService.fetchCompanyOffersByCompany(id);
      console.log("Fetched offers:", data);
      return data;
    },
  });

  const offers = query.data;

  const handleEdit = (offerId: string) => {
    router.push(`/company/${id}/edit-offer/${offerId}`);
  };

  const handleNew = () => {
    router.push(`/company/${id}/create-offer`);
  };

  const handleDelete = async (offerId: string) => {
    try {
      await CompanyOfferService.deleteCompanyOffer(offerId);
      toast.success("L'offre a été supprimée avec succès");
      
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["company_offer", id] });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      toast.error("Une erreur est survenue lors de la suppression de l'offre");
    }
  };

  return (
    <JobsOfferTable 
      jobOffers={offers || []} 
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
    />
  );
};

export default OffersCompanyPage;
