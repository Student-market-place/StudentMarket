"use client";
import CardJobOffer from "@/components/custom-ui/CardOffer";
import CardStudent from "@/components/custom-ui/CardStudent";
import FilterBlock from "@/components/custom-ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Student, StudentWithRelation } from "@/types/student.type";
import StudentService from "@/services/student.service";
import { EnumStatusTYpe } from "@prisma/client";
import { StudentHistoryRelation } from "@/types/studentHistory.type";

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
        status: EnumStatusTYpe.stage,
        skills: [],
      }),
  });

  const students = query.data;

  console.log("students", students);

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

      {/* Contenu dynamique selon l'onglet actif */}
      <div className="flex gap-8">
        <FilterBlock />
        <div className="grid grid-cols-4 gap-8">
          {activeTab === "students" ? (
            // Affichage des étudiants
            <>
              {students?.map((student: StudentWithRelation) => (
                <CardStudent key={student.id} student={student} />
              ))}
            </>
          ) : (
            <>
              <CardJobOffer />
              <CardJobOffer />
              <CardJobOffer />
              <CardJobOffer />
              <CardJobOffer />
              <CardJobOffer />
              <CardJobOffer />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
