"use client";

import { CompanyWithRelation } from "@/types/company.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

interface CompanyProfilCardProps {
  company: CompanyWithRelation;
}

const CompanyProfilCard = ({ company }: CompanyProfilCardProps) => {
  return (
    <Card className="flex flex-col h-fit gap-2 w-[300px] pt-0 shadow-lg rounded-2xl overflow-hidden border-2 items-center transition-all">
      <CardHeader className="p-4 items-center">
        <Avatar className="h-35 w-35 relative">
          <AvatarImage
            src={company.profilePicture?.url}
            alt={`${company.name} logo`}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            {company.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="p-3 text-center">
          <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {company?.user.email}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <Label>Decription : </Label>
        <Card className="mt-2 p-1 bg-gray-100 rounded-sm ">
          <CardContent className="text-sm text-gray-700 p-1">
            {company?.description}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CompanyProfilCard;
