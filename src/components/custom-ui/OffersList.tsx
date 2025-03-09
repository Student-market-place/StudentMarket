import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { useQuery } from "@tanstack/react-query";
import CardJobOffer from "./CardOffer";

const OffersList = () => {
  const query = useQuery({
    queryKey: ["company_offer"],
    queryFn: () => CompanyOfferService.fetchCompanyOffers({}),
  });

  const offers = query.data;
  return (
    <>
      {offers?.map((offer: CompanyOfferWithRelation) => (
        <CardJobOffer key={offer.id} jobOffer={offer} />
      ))}
    </>
  );
};

export default OffersList;
