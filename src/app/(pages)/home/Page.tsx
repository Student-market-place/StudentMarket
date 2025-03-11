"use client";

import FilterBlock from "@/components/custom-ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";

import StudentList from "@/components/custom-ui/StudentList";
import OffersList from "@/components/custom-ui/OffersList";
import CompanyList from "@/components/custom-ui/CompanyList";

// Composants Fallback pour les Suspense
const FilterBlockFallback = () => (
  <div className="p-6 bg-white shadow-md border border-secondary shadow-t-lg rounded-md space-y-4 h-fit w-80">
    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
  </div>
);

const ListFallback = () => (
  <div className="grid grid-cols-4 gap-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-48 bg-gray-100 rounded animate-pulse"></div>
    ))}
  </div>
);

const HomePage = () => {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [activeTab, setActiveTab] = useState<
    "students" | "offers" | "companies"
  >("offers");
  const [isClient, setIsClient] = useState(false);

  // S'assurer que le code s'exécute seulement côté client
  useEffect(() => {
    console.log("🔄 Premier useEffect - Définition de isClient");
    setIsClient(true);
  }, []);

  // Charger les données utilisateur
  useEffect(() => {
    console.log("🔄 Second useEffect - isClient =", isClient);

    if (!isClient) {
      console.log("⏳ Attente du rendu côté client");
      return; // Ne pas exécuter côté serveur
    }

    const loadUser = async () => {
      console.log("📥 Début du chargement de l'utilisateur");
      try {
        const userId = localStorage.getItem("userId");
        console.log("🔑 UserId depuis localStorage:", userId);

        if (!userId) {
          console.log("⚠️ Aucun utilisateur connecté dans localStorage");
          return;
        }

        console.log("🔍 Chargement de l'utilisateur:", userId);
        const userData = await UserService.fetchUserById(userId);
        console.log("✅ Utilisateur chargé avec succès:", userData);
        setUser(userData);
      } catch (error) {
        console.error("❌ Erreur lors du chargement de l'utilisateur:", error);
      }
    };

    loadUser();
  }, [isClient]); // Dépendance à isClient pour s'assurer que le code ne s'exécute que côté client

  // Fonction de test pour charger l'utilisateur directement avec un ID
  // const testLoadUser = async () => {
  //   try {
  //     console.log("🧪 Test de chargement avec ID spécifique");
  //     const testId = "cm82stewk00007kxklv3jtctd";
  //     const userData = await UserService.fetchUserById(testId);
  //     console.log("✅ Test utilisateur chargé:", userData);
  //     setUser(userData);
  //   } catch (error) {
  //     console.error("❌ Erreur test:", error);
  //   }
  // };

  const handleActive = (tab: "students" | "offers" | "companies") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Boutons de sélection */}
      <div className="flex justify-center gap-10">
        {(user?.role === "company" ||
          user?.role === "school" ||
          user?.role === "admin") && (
          <Button
            className={`px-6 py-2 border-2 rounded-md transition-colors ${
              activeTab === "students"
                ? " bg-blue-500 text-white border-transparent hover:bg-blue-500"
                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
            onClick={() => handleActive("students")}
          >
            Étudiants
          </Button>
        )}
        <Button
          className={`px-6 py-2 border-2 rounded-md transition-colors ${
            activeTab === "offers"
              ? " bg-blue-500 text-white border-transparent hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => handleActive("offers")}
        >
          Offres
        </Button>

        <Button
          className={`px-6 py-2 border-2 rounded-md transition-colors ${
            activeTab === "companies"
              ? " bg-blue-500 text-white border-transparent hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => handleActive("companies")}
        >
          Entreprises
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Envelopper FilterBlock dans Suspense */}
        <Suspense fallback={<FilterBlockFallback />}>
          <FilterBlock activeTab={activeTab} />
        </Suspense>

        {/* Envelopper les listes dans Suspense */}
        <Suspense fallback={<ListFallback />}>
          <div className="grid grid-cols-4 gap-8">
            {activeTab === "students" ? (
              <StudentList />
            ) : activeTab === "offers" ? (
              <OffersList />
            ) : (
              <CompanyList />
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
