import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function CompanyProfilCard() {
  return (
    <Card className="relative py-0 flex bg-clip-border bg-white text-gray-700 shadow-md w-[72rem] flex-row">
      <div className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0">
        <Image
          src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Company Profile"
          width={1260}
          height={750}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-6 bg-gradient-to-r text-black">
        <CardTitle className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          TechNova Solutions
        </CardTitle>
        <CardDescription className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Opportunités de stage dans le domaine de la technologie
        </CardDescription>
        <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          🚀 **TechNova Solutions** est une entreprise innovante spécialisée
          dans le développement de logiciels, l&apos;intelligence artificielle
          et la transformation digitale des entreprises. Nous croyons en
          l&apos;importance de la formation et du développement des jeunes
          talents.
          <br />
          <br />
          🔹 **Nos offres de stage :** - Développement Web et Mobile
          (**React.js, Next.js, Flutter**) 📱💻 - Intelligence Artificielle et
          Machine Learning 🤖 - Cybersécurité et protection des données 🔐 -
          Gestion de bases de données et Cloud Computing ☁️ - UX/UI Design et
          conception d&apos;interfaces modernes 🎨
          <br />
          <br />
          🔹 **Pourquoi choisir TechNova Solutions ?** - Accès à des **projets
          concrets et innovants** 🏆 - Encadrement par des **experts du
          domaine** 👩‍💻👨‍💻 - Opportunité d&apos;apprentissage et d&apos;évolution
          rapide 🚀 - Possibilité d&apos;embauche à la fin du stage 🏢
          <br />
          💡 Nous recherchons des stagiaires passionnés, curieux et prêts à
          relever des défis techniques. Rejoignez-nous et participez à la
          création de solutions technologiques qui façonnent le futur !
        </p>
        <div className="flex space-x-4 gap-4 p-4">
          <Button className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600">
            Mes offres d&apos;emploi
          </Button>
          <Button className="px-6 py-3 text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600">
            Mettre à jour le profil
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export default CompanyProfilCard;
