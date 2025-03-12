import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { CompanyOfferResponseDto } from "@/types/dto/company-offer.dto";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CardJobOfferProps {
  jobOffer: CompanyOfferWithRelation | CompanyOfferResponseDto;
}

const CardJobOffer = ({ jobOffer }: CardJobOfferProps) => {
  const router = useRouter();
  
  return (
    <Card className=" w-[250px] p-4 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent  transition-all">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-md font-semibold">
          {jobOffer.title}
        </CardTitle>
        <CardDescription className="text-xs text-gray-500"></CardDescription>
        <p className="text-xs font-medium text-blue-600 mt-1">
          {jobOffer.type}
        </p>
      </CardHeader>
      <CardContent className="px-3 pb-3 ">
        <div className="flex item-center justify-center flex-wrap gap-1 mt-1 ">
          {jobOffer.skills?.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {typeof skill === 'string' ? skill : skill.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 px-3 pb-3 text-center text-xs text-gray-400  justify-center item-center">
        <button 
          className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition"
          onClick={() => router.push(`/apply/${jobOffer.id}`)}
        >
          Postuler
        </button>
        <Link href={`/offer/${jobOffer.id}`}>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition"
          >
            Détails
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardJobOffer;
