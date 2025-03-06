"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentService from "@/services/student.service";
import { StudentWithRelation } from "@/types/student.type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CardStudentProps {
  student: StudentWithRelation;
}

const StudentProfilPage = ({ student }: CardStudentProps) => {
  const { id } = useParams(); // Récupération de l'ID depuis l'URL
  const [studentid, setStudentid] = useState<StudentWithRelation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      StudentService.fetchStudentById(id as string)
        .then((data) => setStudentid(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="flex flex-col  items-center">
        <h1 className="text-3xl font-bold">{student.firstName}</h1>
        <h3>En recherche Alternance</h3>
      </div>
      <div className="flex justify-between w-full py-10 px-30">
        <div className="flex flex-col gap-10 justify-between   items-center">
          <img
            src="/assets/home-img.jpg"
            className="w-[200px] h-[150px] rounded-xl object-cover shadow-lg"
          />

          <div className="flex flex-col gap-5 items-center">
            <h2 className="text-xl font-bold">Biographie</h2>
            <p className="max-w-[500px]">
              Passionnée par le développement web, je suis actuellement en
              première année de Bachelor à l'ESD Bordeaux. Curieuse et
              rigoureuse, j'aime relever des défis techniques et concevoir des
              interfaces modernes et intuitives. Au fil de mes projets, j'ai
              acquis des compétences en React, Vue.js, TypeScript, Tailwind CSS
              et en gestion d’API. Je recherche actuellement un stage pouvant
              évoluer en apprentissage, où je pourrai mettre en pratique mes
              compétences et continuer à apprendre aux côtés de professionnels
              du domaine.
            </p>
            <div className="flex justify-between w-full px-30">
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Telecharger le CV
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Contacter
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-8 w-fit border-2 shadow-lg border-secondary rounded-md h-fit">
          <Tabs defaultValue="infos" className="flex items-center w-[400px]">
            <TabsList className="flex gap-5">
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
            </TabsList>
            <TabsContent value="infos">
              <h2>Informations</h2>
              <ul>
                <li>École</li>
                <li>Disponible ?</li>
                <li>Type de contrat recherché</li>
              </ul>
            </TabsContent>

            <TabsContent value="experience">
              <h2>Expériences</h2>
              <ul>
                <li>
                  <strong>
                    Projet personnel - Application de gestion de recettes :
                  </strong>{" "}
                  Développement d'une application en PHP permettant d'ajouter,
                  modifier et supprimer des recettes, avec phpMyAdmin et Docker.
                </li>
                <li>
                  <strong>Projet scolaire - Redesign de Parkfornight :</strong>{" "}
                  Refonte d'une application d'aide au stationnement en pleine
                  nature, en React avec Tailwind CSS.
                </li>
                <li>
                  <strong>Stage (à définir) :</strong> En recherche d'un stage
                  pouvant mener à un apprentissage pour approfondir mes
                  compétences en développement web.
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="skills">
              <h2>Compétences</h2>
              <ul>
                <li>HTML/CSS</li>
                <li>JavaScript/TypeScript</li>
                <li>React</li>
                <li>Vue.js</li>
                <li>Django</li>
                <li>Tailwind CSS</li>
                <li>Git/GitHub</li>
                <li>Gestion d'API</li>
                <li>Docker</li>
                <li>PHP/MySQL</li>
              </ul>
            </TabsContent>
          </Tabs>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilPage;
