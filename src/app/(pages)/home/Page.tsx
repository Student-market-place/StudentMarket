"use client";

import FilterBlock from "@/components/custom-ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";

import StudentList from "@/components/custom-ui/StudentList";
import OffersList from "@/components/custom-ui/OffersList";
import CompanyList from "@/components/custom-ui/CompanyList";

const HomePage = () => {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "offers" | "companies">("offers");

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      UserService.fetchUserById(userId)
        .then(data => setUser(data))
        .catch(err => console.error("Erreur lors du chargement de l'utilisateur:", err));
    }
    console.log("🔍 Utilisateur chargé:", user);
  }, []);

  const handleActive = (tab: "students" | "offers" | "companies") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Boutons de sélection */}
      <div className="flex justify-center gap-10">
        {user?.role === "company" || user?.role === "school" || user?.role === "admin" && (
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
        <FilterBlock />
        <div className="grid grid-cols-4 gap-8">
          {activeTab === "students" ? (
            <>
              <StudentList />
            </>
          ) : activeTab === "offers" ? (
            <OffersList />
          ) : (
            <CompanyList />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
