import CompanyService from "@/services/company.service";
import { CompanyWithRelation } from "@/types/company.type";
import { useQuery } from "@tanstack/react-query";
import CardCompany from "./CardCompany";

const CompanyList = () => {
  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await CompanyService.fetchCompanies();
      return response as unknown as CompanyWithRelation[];
    },
  });

  return (
    <>
      {companies?.map((company) => (
        <CardCompany key={company.id} company={company} />
      ))}
    </>
  );
};

export default CompanyList;
