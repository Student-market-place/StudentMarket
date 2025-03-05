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
