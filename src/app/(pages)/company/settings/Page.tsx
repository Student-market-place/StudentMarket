import { CompanyProfilCard } from "@/components/custom-ui/CompanyProfilCard";

const SettingsCompanyPage = () => {
  console.log("🚀 ~ SettingsCompanyPage ~ SettingsCompanyPage:");
  return (
    <div>
      <h1 className="text-4xl p-6  font-extrabold text-center text-gray-800 dark:text-white mt-6 mb-4 tracking-wide">
        🏢 Bienvenue dans l’espace de gestion de votre entreprise.
      </h1>
      <div className="flex justify-center items-center flex-col">
        <CompanyProfilCard />
      </div>
    </div>
  );
};

export default SettingsCompanyPage;
