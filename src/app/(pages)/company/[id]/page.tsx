import { Button } from "@/components/ui/button";

const CompanyProfilPage = () => {
  return (
    <div className="flex  w-full p-10 justify-between">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex flex-col  items-center">
          <h1 className="text-3xl font-bold">Nom de l'entreprise</h1>
          <h3>En recherche Alternance</h3>
        </div>

        <div className="flex flex-col gap-10 justify-between   items-center">
          <img
            src="/assets/home-img.jpg"
            className="w-[200px] h-[150px] rounded-xl object-cover shadow-lg"
          />

          <div className="flex flex-col gap-5 items-center">
            <h2 className="text-xl font-bold">L'entreprise</h2>
            <p className="max-w-[500px] text-center">
              [Nom de l’entreprise] est une agence digitale spécialisée dans le
              développement web et mobile. Nous concevons des solutions
              innovantes sur mesure, allant de la création d’applications et de
              sites web à l’intégration d’outils digitaux performants. Notre
              équipe, composée de passionnés de technologie, allie expertise
              technique et créativité pour répondre aux besoins de nos clients
              et offrir des expériences numériques optimales. Nous recherchons
              des talents motivés pour rejoindre notre aventure et participer à
              des projets stimulants au sein d’un environnement collaboratif et
              dynamique. Rejoignez-nous et construisons ensemble le futur du
              digital ! 🚀
            </p>

            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              Contacter
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-[500px]">
        <h2 className="text-xl font-bold">Offres en cours</h2>
        <div className="flex gap-5 justify-between p-5 border border-secondary rounded-md">
          <h3>Offre de l'entreprise</h3>{" "}
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">Voir</Button>
        </div>
        <div className="flex gap-5 justify-between p-5 border border-secondary rounded-md">
          <h3>Offre de l'entreprise</h3>{" "}
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">Voir</Button>
        </div>
        <div className="flex gap-5 justify-between p-5 border border-secondary rounded-md">
          <h3>Offre de l'entreprise</h3>{" "}
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">Voir</Button>
        </div>
        <div className="flex gap-5 justify-between p-5 border border-secondary rounded-md">
          <h3>Offre de l'entreprise</h3>{" "}
          <Button className="bg-blue-500 hover:bg-blue-700 w-fit">Voir</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilPage;
