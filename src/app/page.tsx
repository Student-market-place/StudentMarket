import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full gap-10 md:gap-16">
      {/* Section Hero */}
      <div className="flex flex-col md:flex-row px-4 md:px-20 gap-8 md:gap-12">
        <div className="flex flex-col justify-between space-y-6 md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Student Market, la solution des étudiants et entreprises.
          </h1>
          <p className="text-gray-700">
            Student Market est une plateforme qui simplifie la mise en relation
            entre étudiants en quête de stages ou d&apos;alternances et
            entreprises à la recherche de nouveaux talents. En facilitant le
            processus de candidature et de recrutement, nous offrons un espace
            efficace et intuitif pour connecter les besoins des uns avec les
            opportunités des autres.
          </p>
          <Link href="/auth/register">
            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              S&apos;inscrire
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/assets/home-img.jpg"
            alt="Étudiants et recruteurs collaborant ensemble"
            width={500}
            height={300}
            className="w-full h-auto object-cover shadow-lg rounded-xl"
            priority
          />
        </div>
      </div>

      {/* Section Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-40 border-b-2 pb-10 md:pb-20">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-xl md:text-2xl font-bold">+ 500</h2>
          <p className="text-sm md:text-base">Étudiants déjà inscrits</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-xl md:text-2xl font-bold">+ 10</h2>
          <p className="text-sm md:text-base">Écoles Partenaires</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-xl md:text-2xl font-bold">+ 200</h2>
          <p className="text-sm md:text-base">Offres déjà publiées</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-xl md:text-2xl font-bold">+ 30</h2>
          <p className="text-sm md:text-base">Entreprises nous font confiance</p>
        </div>
      </div>

      {/* Section Pour qui */}
      <div className="flex flex-col items-center px-4 md:px-40 gap-10 md:gap-16">
        {/* Pour les étudiants */}
        <div className="flex flex-col md:flex-row w-full justify-between gap-8">
          <div className="flex flex-col justify-between py-5 space-y-4 md:w-3/5">
            <h2 className="text-xl font-semibold">Pour les étudiants</h2>
            <p className="text-gray-700">
              Student Market vous permet de trouver facilement un stage ou une
              alternance en postulant directement aux offres des entreprises.
              Une fois votre profil complété, vous pouvez parcourir les offres
              disponibles et envoyer vos candidatures en quelques clics. Chaque
              offre affiche les détails importants (mission, durée,
              rémunération) pour vous aider à choisir la meilleure opportunité.
              Pour accéder à la plateforme et postuler, votre école doit être
              partenaire de Student Market.
            </p>
            <Link href="/auth/register?type=student">
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Créer mon profil
              </Button>
            </Link>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <Image
              src="/assets/card-job-offer.png"
              className="w-full max-w-[300px] h-auto object-cover shadow-lg rounded-md"
              alt="Exemple de carte d'offre d'emploi"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Pour les entreprises */}
        <div className="flex flex-col-reverse md:flex-row w-full justify-between gap-8">
          <div className="md:w-2/5 flex justify-center">
            <Image
              src="/assets/card-student.png"
              className="w-full max-w-[250px] h-auto object-cover shadow-lg rounded-md"
              alt="Exemple de profil étudiant"
              width={250}
              height={300}
            />
          </div>
          <div className="flex flex-col justify-between py-5 space-y-4 md:w-3/5">
            <h2 className="text-xl font-semibold">Pour les entreprises</h2>
            <p className="text-gray-700">
              Sur Student Market, vous avez l&apos;opportunité de toucher
              directement les talents les plus motivés et qualifiés. Publiez vos
              offres et accédez à une sélection de profils d&apos;étudiants
              détaillés, où vous pouvez évaluer leurs compétences, leur
              expérience et leurs projets réalisés. Gérez les candidatures en
              toute simplicité, consultez les profils des étudiants qui
              postulent et suivez facilement l&apos;évolution de vos
              recrutements.
              <br /> Student Market vous permet de gagner en efficacité et de
              trouver rapidement les talents qui feront la différence dans vos
              projets
            </p>
            <Link href="/auth/register?type=company">
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Créer mon profil
              </Button>
            </Link>
          </div>
        </div>

        {/* Pour les écoles */}
        <div className="flex flex-col md:flex-row w-full justify-between gap-8 mb-10">
          <div className="flex flex-col justify-between py-5 space-y-4 md:w-3/5">
            <h2 className="text-xl font-semibold">Pour les écoles</h2>
            <p className="text-gray-700">
              Afin de garantir la qualité et la fiabilité des profils étudiants,
              l&apos;inscription sur Student Market est réservée aux écoles
              partenaires. Si vous êtes intéressé(e), vous devez nous contacter
              pour souscrire à une formule payante, permettant ainsi à vos
              étudiants d&apos;accéder aux offres et de postuler aux
              opportunités proposées par les entreprises. <br /> Un accès vous
              sera dédié à la plateforme, avec un tableau de bord incluant des
              visualisations de données et la liste des étudiants inscrits.
            </p>
            <Link href="/contact">
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Devenir Partenaire
              </Button>
            </Link>
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
