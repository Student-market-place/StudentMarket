"use client";
import CardJobOffer from "@/components/custom-ui/CardOffer";
import CardStudent from "@/components/custom-ui/CardStudent";
import FilterBlock from "@/components/custom-ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import { StudentWithRelation } from "@/types/student.type";
import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"students" | "offers">("students");

  const handleActive = (tab: "students" | "offers") => {
    setActiveTab(tab);
  };

  const query = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      StudentService.fetchStudents({
        isAvailable: true,
      }),
  });

  const queryOffers = useQuery({
    queryKey: ["company_offer"],
    queryFn: () => CompanyOfferService.fetchCompanyOffers({}),
  });

  const students = query.data;
  const offers = queryOffers.data;

  console.log("query", query);
  console.log("queryOffers", queryOffers);
  console.log("students", students);
  console.log("offers", offers);

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Boutons de sélection */}
      <div className="flex justify-center gap-10">
        <Button
          className={`px-6 py-2 border-2 rounded-md transition-colors ${
            activeTab === "students"
              ? " bg-blue-500 text-white border-transparent hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => handleActive("students")}
        >
          Étudiants
        </Button>
        <Button
          className={`px-6 py-2 border-2 rounded-md transition-colors ${
            activeTab === "offers"
              ? " bg-blue-500 text-white border-transparent hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => handleActive("offers")}
        >
          Offres
        </Button>
      </div>

      <div className="flex gap-8">
        <FilterBlock />
        <div className="grid grid-cols-4 gap-8">
          {activeTab === "students" ? (
            <>
              {students?.map((student: StudentWithRelation) => (
                <CardStudent key={student.id} student={student} />
              ))}
            </>
          ) : (
            <>
              {offers?.map((offer: CompanyOfferWithRelation) => (
                <CardJobOffer key={offer.id} jobOffer={offer} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
