import { Button } from "@/components/ui/button";

import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-30 w-full">
      <div className="flex  px-20 gap-30">
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold">
            Student Market, la solution des étudiants et entreprises.
          </h1>
          <p>
            Student Market est une plateforme qui simplifie la mise en relation
            entre étudiants en quête de stages ou d&apos;alternances et
            entreprises à la recherche de nouveaux talents. En facilitant le
            processus de candidature et de recrutement, nous offrons un espace
            efficace et intuitif pour connecter les besoins des uns avec les
            opportunités des autres.
          </p>
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
            S&apos;inscrire
          </Button>
        </div>
        <Image
          src="/assets/home-img.jpg"
          alt=""
          width={500}
          height={300}
          className="w-full h-full object-cover shadow-lg rounded-xl"
        />
      </div>
      <div className="flex justify-between px-40 border-b-2 pb-20">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">+ 500</h1>
          <p>Etudiants déjà inscrits</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">+ 10</h1>
          <p>Ecoles Partenaires</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">+ 200</h1>
          <p>Offres déjà publiées</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">+ 30</h1>
          <p>Entreprises nous font confiance</p>
        </div>
      </div>

      <div className="flex flex-col items-center px-40 gap-25">
        <div className="flex w-full justify-between">
          <div className="flex flex-col justify-between py-5">
            <h2 className="text-xl font-semibold">Pour les étudiants</h2>
            <p className="max-w-2xl">
              Student Market vous permet de trouver facilement un stage ou une
              alternance en postulant directement aux offres des entreprises.
              Une fois votre profil complété, vous pouvez parcourir les offres
              disponibles et envoyer vos candidatures en quelques clics. Chaque
              offre affiche les détails importants (mission, durée,
              rémunération) pour vous aider à choisir la meilleure opportunité.
              Pour accéder à la plateforme et postuler, votre école doit être
              partenaire de Student Market.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              Créer mon profil
            </Button>
          </div>
          <Image
            src="/assets/card-job-offer.png"
            className="w-[300px] h-[300px] object-cover shadow-lg"
            alt="Aperçu d'une offre"
            width={300}
            height={300}
          />
        </div>
        <div className="flex w-full justify-between ">
          <Image
            src="/assets/card-student.png"
            className="w-[250px] max-h-[300px] object-fit shadow-lg"
            alt="Aperçu d'une offre"
            width={250}
            height={300}
          />
          <div className="flex flex-col justify-between py-5">
            <h2 className="text-xl font-semibold">Pour les entreprises</h2>
            <p className="max-w-2xl">
              Sur Student Market, vous avez l&apos;opportunité de toucher
              directement les talents les plus motivés et qualifiés. Publiez vos
              offres et accédez à une sélection de profils d&apos;étudiants
              détaillés, où vous pouvez évaluer leurs compétences, leur
              expérience et leurs projets réalisés. Gérez les candidatures en
              toute simplicité, consultez les profils des étudiants qui
              postulent et suivez facilement l&apos;évolution de vos recrutements.
              <br /> Student Market vous permet de gagner en efficacité et de
              trouver rapidement les talents qui feront la différence dans vos
              projets
            </p>
            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              Créer mon profil
            </Button>
          </div>
        </div>
        <div className="flex w-full justify-between ">
          <div className="flex flex-col justify-between py-5">
            <h2 className="text-xl font-semibold">Pour les écoles</h2>
            <p className="max-w-2xl">
              Afin de garantir la qualité et la fiabilité des profils étudiants,
              l&apos;inscription sur Student Market est réservée aux écoles
              partenaires. Si vous êtes intéressé(e), vous devez nous contacter
              pour souscrire à une formule payante, permettant ainsi à vos
              étudiants d&apos;accéder aux offres et de postuler aux
              opportunités proposées par les entreprises. <br /> Un accès vous
              sera dédié à la plateforme, avec un tableau de bord incluant des
              visualisations de données et la liste des étudiants inscrits.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              Devenir Partenaire
            </Button>
          </div>
          <Image
            src="/assets/card-job-offer.png"
            className="w-[300px] h-[300px] object-cover shadow-lg"
            alt="Aperçu d'une offre"
            width={300}
            height={300}
          />
        </div>
      </div>
      <div className="flex justify-center gap-10">
        <Link href="/privacy-policy">Politique de confidentialité</Link>
        <Link href="/terms-of-use">Conditions d&apos;utilisations</Link>
      </div>
    </div>
  );
}
