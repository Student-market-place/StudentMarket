import { CompanyWithRelation } from "@/types/company.type";
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
import Image from "next/image";
import { Button } from "../ui/button";
interface CardCompanyProps {
  company: CompanyWithRelation;
}

const CardCompany = ({ company }: CardCompanyProps) => {

  console.log(company);

  return (
    <Card className="flex flex-col h-fit gap-2 w-[250px] p-0 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent  transition-all">
      <CardHeader className="p-0">
        <Image
          src={company.profilePicture?.url ?? "/default-avatar.png"}
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
          <Button variant="outline">Voir l'entreprise</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardCompany;
