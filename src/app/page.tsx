import { Button } from "@/components/ui/button";

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
            entre étudiants en quête de stages ou d'alternances et entreprises à
            la recherche de nouveaux talents. En facilitant le processus de
            candidature et de recrutement, nous offrons un espace efficace et
            intuitif pour connecter les besoins des uns avec les opportunités
            des autres.
          </p>
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
            S'inscrire
          </Button>
        </div>
        <img
          src="/assets/home-img.jpg"
          alt=""
          className="w-[500px] h-[300px] object-cover shadow-lg rounded-xl"
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
          <div className="flex flex-col gap-3">
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
          </div>
          <img
            src="/assets/card-job-offer.png"
            className="w-[300px] h-[300px] object-cover shadow-lg"
            alt="Aperçu d'une offre"
          />
        </div>
        <div className="flex w-full justify-between">
          <img
            src="/assets/card-student.png"
            className="w-[250px] max-h-[300px] object-fit shadow-lg"
            alt="Aperçu d'une offre"
          />
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">Pour les entreprises</h2>
            <p className="max-w-2xl">
              Les entreprises ont accès à une liste d'étudiants qualifiés ainsi
              qu'aux candidatures qu'ils reçoivent. Elles peuvent ainsi
              consulter les profils et contacter directement les étudiants qui
              correspondent à leurs besoins. Publier une offre sur Student
              Market leur permet de gagner en visibilité et d'attirer des
              candidats motivés.
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">Pour les écoles</h2>
            <p className="max-w-2xl">
              Afin de garantir la qualité et la fiabilité des profils étudiants,
              l'inscription sur Student Market est réservée aux écoles
              partenaires. Les établissements doivent souscrire à une formule
              payante permettant à leurs étudiants d'accéder aux offres et de
              postuler aux opportunités proposées par les entreprises.
            </p>
          </div>
          <img
            src="/assets/card-job-offer.png"
            className="w-[300px] h-[300px] object-cover shadow-lg"
            alt="Aperçu d'une offre"
          />
        </div>
      </div>
    </div>
  );
}
