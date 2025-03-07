import { Button } from "@/components/ui/button";

const SingleOfferPage = () => {
  return (
    <div className="flex justify-center ">
      <h1 className="text-2xl font-bold mb-6">Offer Company Page</h1>

      <div className="flex flex-col items-end p-6">
        <div className="flex flex-col gap-5 items-center bg-white shadow-lg p-6 rounded-lg max-w-2xl">
          <h1 className="text-xl font-bold">Offre</h1>

          <h2 className="text-xl font-bold text-blue-600 text-center">
            🚀 Offre d&apos;Alternance – Développeur Next.js (H/F)
          </h2>

          <p className="text-center">
            🔎{" "}
            <strong>
              Tu cherches une alternance en développement web avec Next.js ?
            </strong>
            🚀 Rejoins une équipe passionnée et participe à des projets
            innovants en **React & Next.js** !
          </p>

          <h3 className="text-lg font-semibold">👨‍💻 Qui sommes-nous ?</h3>
          <p className="text-center">
            [Nom de l&apos;entreprise] est une startup / entreprise spécialisée
            dans **[secteur d&apos;activité]**. Nous développons des
            applications web modernes et performantes, en mettant l&apos;accent
            sur l&apos;expérience utilisateur et la scalabilité.
          </p>

          <h3 className="text-lg font-semibold">🎯 Tes missions</h3>
          <ul className="text-left list-disc list-inside">
            <li>
              ✅ Développement d&apos;interfaces web en **React / Next.js**
            </li>
            <li>
              ✅ Optimisation des performances (**SSR, SSG, ISR, API Routes**)
            </li>
            <li>
              ✅ Intégration d&apos;APIs et de bases de données (**Firebase,
              Supabase, PostgreSQL**)
            </li>
            <li>
              ✅ Amélioration de l&apos;expérience utilisateur avec des animations
              avancées
            </li>
            <li>
              ✅ Mise en place des bonnes pratiques (**SEO, accessibilité,
              tests**)
            </li>
          </ul>

          <h3 className="text-lg font-semibold">🔧 Profil recherché</h3>
          <ul className="text-left list-disc list-inside">
            <li>
              🎓 Étudiant(e) en informatique, développement web ou équivalent
            </li>
            <li>
              💡 Passionné(e) par **Next.js, React et le développement
              front-end**
            </li>
            <li>
              🛠 Compétences appréciées : **TypeScript, TailwindCSS, Node.js,
              Prisma**
            </li>
            <li>📌 Bonne compréhension de **Git et des workflows CI/CD**</li>
          </ul>

          <h3 className="text-lg font-semibold">
            🎁 Ce que nous t&apos;offrons
          </h3>
          <ul className="text-left list-disc list-inside">
            <li>
              🚀 Un environnement technique stimulant avec des projets concrets
            </li>
            <li>
              📚 Une montée en compétences sur les dernières technologies web
            </li>
            <li>🏡 Télétravail partiel possible</li>
            <li>🍕 Une équipe sympa, des échanges et du fun !</li>
          </ul>

          <p className="text-center font-medium">
            📩 **Envie de nous rejoindre ?** Envoie ton CV et un lien vers tes
            projets (**GitHub, Portfolio…**) à **[email de contact]**
          </p>
          <div className="flex gap-5 justify-between  rounded-md">
            <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
              Contacter
            </Button>
            <Button className="bg-green-500 hover:bg-green-700 w-fit">
              Postuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOfferPage;