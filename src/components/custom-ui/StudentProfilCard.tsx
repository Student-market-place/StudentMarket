import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function StudentProfilCard() {
  return (
    <Card className="relative py-0 flex bg-clip-border  bg-white text-gray-700 shadow-md  w-[72rem] flex-row">
      <div className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0">
        <img
          src="https://images.pexels.com/photos/4298629/pexels-photo-4298629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Student Profile"
          width={1260}
          height={750}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className=" p-6 bg-gradient-to-r text-black">
        <CardTitle className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          Maria Karpova
        </CardTitle>
        <CardDescription className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Étudiante en développement à la recherche d&aposun stage
        </CardDescription>
        <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          ✨ Passionnée par la programmation et les nouvelles technologies, je
          suis à la recherche d&aposun stage afin d&aposacquérir une expérience
          pratique et approfondir mes compétences en développement logiciel.
          💻🚀
          <br />
          <br />
          🔹 **Compétences techniques :**
          <br /> - Développement web avec **React.js / Next.js** ⚛️
          <br /> - Backend avec **Node.js / Express** <br />
          🌐 - Bases de données : **MongoDB / PostgreSQL**
          <br /> - Intégration d&aposAPIs et gestion des requêtes HTTP <br />
          🔄 - Conception responsive avec **Tailwind CSS** et **CSS Modules** 🎨
          <br />
          <br />
          🔹 **Qualités personnelles :** - Esprit d&aposanalyse et capacité à
          résoudre des problèmes efficacement 🔍 - Travail en équipe et
          communication claire 🤝 - Capacité d&aposadaptation aux nouvelles
          technologies 📈 - Créativité et innovation dans le développement
          d&aposapplications 🌟
          <br />
          💡 Toujours avide d&aposapprendre, j&aposaime relever des défis
          techniques et travailler sur des projets innovants. Mon objectif est
          d&aposévoluer dans un environnement stimulant où je pourrai mettre en
          pratique mes compétences et contribuer activement au succès de
          l&aposéquipe. 🎯🔥
        </p>
        <div className=" justify-items-center flex space-y-4 gap-7 p-7">
          <Button>Ma candidature</Button>
          <Button>Mettre à jour le profil</Button>
        </div>
      </CardHeader>
    </Card>
  );
}
export default StudentProfilCard;
