import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StudentProfilCard() {
  return (
    <Card className="relative py-0 flex bg-clip-border  bg-white text-gray-700 shadow-md  w-[72rem] flex-row">
      <div className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0">
        <img
          src="https://images.pexels.com/photos/4298629/pexels-photo-4298629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Company"
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className=" p-6 bg-gradient-to-r text-black">
        <CardTitle className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          Maria Karpova
        </CardTitle>
        <CardDescription className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Étudiante en développement à la recherche d'un stage
        </CardDescription>
        <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          ✨ Passionnée par la programmation et les nouvelles technologies, je
          suis à la recherche d'un stage afin d'acquérir une expérience pratique
          et approfondir mes compétences en développement logiciel. 💻🚀
          <br />
          <br />
          🔹 **Compétences techniques :**
          <br /> - Développement web avec **React.js / Next.js** ⚛️
          <br /> - Backend avec **Node.js / Express** <br />
          🌐 - Bases de données : **MongoDB / PostgreSQL**
          <br /> - Intégration d'APIs et gestion des requêtes HTTP <br />
          🔄 - Conception responsive avec **Tailwind CSS** et **CSS Modules** 🎨
          <br />
          <br />
          🔹 **Qualités personnelles :** - Esprit d'analyse et capacité à
          résoudre des problèmes efficacement 🔍 - Travail en équipe et
          communication claire 🤝 - Capacité d'adaptation aux nouvelles
          technologies 📈 - Créativité et innovation dans le développement
          d'applications 🌟
          <br />
          💡 Toujours avide d'apprendre, j'aime relever des défis techniques et
          travailler sur des projets innovants. Mon objectif est d’évoluer dans
          un environnement stimulant où je pourrai mettre en pratique mes
          compétences et contribuer activement au succès de l’équipe. 🎯🔥
        </p>
      </CardHeader>
    </Card>
  );
}
export default StudentProfilCard;
