"use client";

import { useQuery } from "@tanstack/react-query";
import CompanyOfferService from "@/services/companyOffer.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CalendarIcon, BriefcaseIcon, BuildingIcon } from "lucide-react";
import { useParams } from "next/navigation";

// Type de params adapté à Next.js
// type PageParams = {
//   params: {
//     id: string;
//   };
// };

export default function OfferPage() {
  // Utilisation de useParams au lieu de recevoir params comme prop
  const params = useParams();
  const id = params.id as string;

  const { data: offer, isLoading } = useQuery<CompanyOfferWithRelation>({
    queryKey: ["company_offer", id],
    queryFn: () => CompanyOfferService.fetchCompanyOffer(id),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_cours":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "terminee":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "annulee":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_cours":
        return "En cours";
      case "terminee":
        return "Terminée";
      case "annulee":
        return "Annulée";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="w-full h-[200px] animate-pulse bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold">Offre non trouvée</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="w-full">
        <CardHeader className="space-y-4">
          {/* En-tête avec titre et badges */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold">
                {offer.title}
              </CardTitle>
              <Badge
                className="text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 uppercase font-bold whitespace-nowrap"
                variant="outline"
              >
                {offer.type === "stage" ? "Stage" : "Alternance"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-sm sm:text-base",
                  getStatusColor(offer.status)
                )}
              >
                {getStatusLabel(offer.status)}
              </Badge>
            </div>
          </div>

          {/* Informations clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Entreprise</p>
                <p className="text-sm text-gray-500">{offer.company.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Date de début</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(offer.startDate), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Type de contrat</p>
                <p className="text-sm text-gray-500">
                  {offer.type === "stage" ? "Stage" : "Alternance"}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Description
            </h3>
            <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-700">
              {offer.description}
            </p>
          </div>

          {/* Compétences requises */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Compétences requises
            </h3>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Informations sur l&apos;entreprise */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              À propos de l&apos;entreprise
            </h3>
            {offer.company.description && (
              <p className="text-sm sm:text-base text-gray-700">
                {offer.company.description}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          <Link
            href={`/company/${offer.company.id}`}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              Voir l&apos;entreprise
            </Button>
          </Link>
          {offer.status === "en_cours" && (
            <Link href={`/apply/${offer.id}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Postuler</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
