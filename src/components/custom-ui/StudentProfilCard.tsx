import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { StudentWithRelation } from "@/types/student.type";

interface StudentProfilCardProps {
  student: StudentWithRelation;
}

export function StudentProfilCard({ student }: StudentProfilCardProps) {
  // Fonction pour obtenir l'URL valide de l'image de profil
  const getValidImageUrl = () => {
    try {
      // Vérifier si profilePicture existe et si l'URL est définie
      const url = student?.profilePicture?.url;
      
      // Si l'URL n'existe pas ou est vide, utiliser l'image par défaut
      if (!url) return "/default-avatar.png";
      
      // Vérifier si l'URL est valide en essayant de créer un objet URL
      new URL(url);
      return url;
    } catch (error) {
      // En cas d'URL invalide, utiliser l'image par défaut
      console.warn("URL d'image invalide pour l'étudiant:", student?.firstName, student?.lastName);
      return "/default-avatar.png";
    }
  };

  return (
    <Card className="relative py-0 flex bg-clip-border bg-white text-gray-700 shadow-md w-full max-w-md flex-col">
      <div className="relative overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl">
        <Image
          src={getValidImageUrl()}
          alt={`${student.firstName} ${student.lastName}`}
          width={400}
          height={300}
          className="object-cover w-full h-64"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {student.firstName} {student.lastName}
        </CardTitle>
        <CardDescription>
          {student.school?.name || "École non spécifiée"}
        </CardDescription>
      </CardHeader>

      <div className="p-6 pt-0">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${student.isAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
          <p className="text-sm">{student.isAvailable ? "Disponible" : "Non disponible"}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-1">Recherche:</h3>
          <p className="text-gray-600">{student.status}</p>
        </div>

        {student.description && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">À propos:</h3>
            <p className="text-gray-600 text-sm">{student.description}</p>
          </div>
        )}

        {student.CV?.url && (
          <div className="mt-4">
            <a href={student.CV.url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full" variant="outline">
                Voir le CV
              </Button>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
