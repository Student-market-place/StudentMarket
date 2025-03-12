import { CompanyWithRelation } from "@/types/company.type";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
interface CardCompanyProps {
  company: CompanyWithRelation;
}

const CardCompany = ({ company }: CardCompanyProps) => {
  // Fonction pour vérifier si l'URL est valide
  const getValidImageUrl = () => {
    try {
      // Vérifier si profilePicture existe et si l'URL est définie
      const url = company.profilePicture?.url;
      
      // Si l'URL n'existe pas ou est vide, utiliser l'image par défaut
      if (!url) return "/default-avatar.png";
      
      // Vérifier si l'URL est valide en essayant de créer un objet URL
      new URL(url);
      return url;
    } catch (error) {
      // En cas d'URL invalide, utiliser l'image par défaut
      console.warn("URL d'image invalide pour l'entreprise:", company.name);
      return "/default-avatar.png";
    }
  };

  const imageUrl = getValidImageUrl();

  return (
    <Card className="flex flex-col h-fit gap-2 w-[250px] p-0 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent  transition-all">
      <CardHeader className="p-0">
        <Image
          src={imageUrl}
          alt="Company"
          width={250}
          height={140}
          className="w-full h-35 object-cover"
        />
        <div className="p-3 text-center">
          <CardTitle className="text-md font-semibold">
            {company?.name}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {company?.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="p-3 text-center">
        <Link href={`/company/${company.id}`}>
          <Button variant="outline">Voir l&apos;entreprise</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardCompany;
