"use client";

import StudentService from "@/services/student.service";
import { StudentWithRelation } from "@/types/student.type";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CardStudent from "./CardStudent";
import { useEffect } from "react";

// Composant wrapper qui utilise useSearchParams
const StudentList = () => {
  const searchParams = useSearchParams();
  
  // Récupérer les paramètres de filtrage depuis l'URL
  const availability = searchParams.get("availability");
  const contractType = searchParams.get("contractType");
  const skillId = searchParams.get("skills");
  const schoolId = searchParams.get("school");
  
  return (
    <StudentListContent 
      availability={availability}
      contractType={contractType}
      skillId={skillId}
      schoolId={schoolId}
    />
  );
};

// Composant de contenu qui ne dépend pas directement de useSearchParams
const StudentListContent = ({
  availability,
  contractType,
  skillId,
  schoolId
}: {
  availability: string | null;
  contractType: string | null;
  skillId: string | null;
  schoolId: string | null;
}) => {
  // Construire l'URL de l'API avec les paramètres de filtrage
  const getApiUrl = () => {
    const params = new URLSearchParams();
    
    if (availability) params.append("availability", availability);
    if (contractType) params.append("contractType", contractType);
    if (skillId) params.append("skills", skillId);
    if (schoolId) params.append("school", schoolId);
    
    const queryString = params.toString();
    return `/api/student/filter${queryString ? `?${queryString}` : ''}`;
  };
  
  const { data: students, refetch } = useQuery({
    queryKey: ["students", availability, contractType, skillId, schoolId],
    queryFn: async () => {
      const response = await fetch(getApiUrl());
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des étudiants");
      }
      return await response.json();
    },
  });
  
  // Rafraîchir les données lorsque les paramètres de filtrage changent
  useEffect(() => {
    refetch();
  }, [availability, contractType, skillId, schoolId, refetch]);

  if (!students) {
    return <div>Chargement...</div>;
  }

  if (students.length === 0) {
    return <div className="col-span-4 text-center py-8">Aucun étudiant trouvé</div>;
  }

  return (
    <>
      {students.map((student: StudentWithRelation) => (
        <CardStudent key={student.id} student={student} />
      ))}
    </>
  );
};

export default StudentList;
