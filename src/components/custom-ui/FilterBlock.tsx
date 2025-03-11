"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface FilterBlockProps {
  activeTab: "students" | "offers" | "companies";
}

interface Skill {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

const FilterBlock = ({ activeTab }: FilterBlockProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États communs
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  
  // États spécifiques aux étudiants
  const [availability, setAvailability] = useState(searchParams.get("availability") || "");
  const [contractType, setContractType] = useState(searchParams.get("contractType") || "");
  const [school, setSchool] = useState(searchParams.get("school") || "");
  const [schools, setSchools] = useState<School[]>([]);
  
  // États spécifiques aux offres
  const [offerType, setOfferType] = useState(searchParams.get("type") || "");
  
  // États spécifiques aux entreprises
  const [companyName, setCompanyName] = useState(searchParams.get("name") || "");

  // Chargement des données depuis la base de données
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Récupération des compétences
        const skillsData = await fetch('/api/skills').then(res => res.json());
        setSkills(skillsData);
        
        // Récupération des écoles si on est sur l'onglet étudiants
        if (activeTab === "students") {
          const schoolsData = await fetch('/api/schools').then(res => res.json());
          setSchools(schoolsData);
        }

        // Initialiser les compétences sélectionnées à partir des paramètres d'URL
        const skillsParam = searchParams.get("skills");
        if (skillsParam) {
          const skillIds = skillsParam.split(',');
          const selectedSkillsFromUrl = skillIds.map(id => {
            const skill = skillsData.find((s: Skill) => s.id === id);
            return skill ? skill : null;
          }).filter(Boolean);
          
          setSelectedSkills(selectedSkillsFromUrl);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données de filtrage:", error);
      }
    };
    
    fetchFilterData();
  }, [activeTab, searchParams]);

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    
    if (!selectedId) return; // Si l'option "Sélectionner" est choisie, ne rien faire
    
    if (!selectedSkills.some(s => s.id === selectedId)) {
      const skillToAdd = skills.find(s => s.id === selectedId);
      if (skillToAdd) {
        setSelectedSkills([...selectedSkills, skillToAdd]);
      }
    }
    
    // Réinitialiser le select à l'option par défaut
    e.target.value = "";
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  // Fonction pour appliquer les filtres
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Filtres communs (compétences)
    if (selectedSkills.length > 0) {
      params.set("skills", selectedSkills.map(s => s.id).join(','));
    }
    
    // Filtres spécifiques selon l'onglet actif
    if (activeTab === "students") {
      if (availability) params.set("availability", availability);
      if (contractType) params.set("contractType", contractType);
      if (school) params.set("school", school);
    } else if (activeTab === "offers") {
      if (offerType) params.set("type", offerType);
    } else if (activeTab === "companies") {
      if (companyName) params.set("name", companyName);
    }
    
    // Mise à jour de l'URL avec les paramètres de recherche
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };
  
  const resetFilters = () => {
    // Réinitialisation des états selon l'onglet actif
    setSelectedSkills([]);
    
    if (activeTab === "students") {
      setAvailability("");
      setContractType("");
      setSchool("");
    } else if (activeTab === "offers") {
      setOfferType("");
    } else if (activeTab === "companies") {
      setCompanyName("");
    }
    
    // Redirection vers l'URL sans paramètres
    router.push(window.location.pathname);
  };

  return (
    <div className="p-6 bg-white shadow-md border border-secondary shadow-t-lg rounded-md space-y-4 h-fit w-80">
      <h2 className="text-xl font-semibold">Filtrer les résultats</h2>

      {/* Section de filtres communs pour les compétences */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium">
          Compétences
        </label>
        <select
          id="skills"
          defaultValue=""
          onChange={handleSkillChange}
          className="mt-2 p-2 border rounded-md w-full"
        >
          <option value="">Sélectionner une compétence</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        {/* Affichage des compétences sélectionnées */}
        {selectedSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <div 
                key={skill.id} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
              >
                {skill.name}
                <button 
                  onClick={() => removeSkill(skill.id)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtres spécifiques pour les étudiants */}
      {activeTab === "students" && (
        <>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium">
              Disponibilité
            </label>
            <select
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
            >
              <option value="">Tous</option>
              <option value="true">Disponible</option>
              <option value="false">Non Disponible</option>
            </select>
          </div>

          <div>
            <label htmlFor="contractType" className="block text-sm font-medium">
              Type de contrat
            </label>
            <select
              id="contractType"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
            >
              <option value="">Tous</option>
              <option value="stage">Stage</option>
              <option value="alternance">Alternance</option>
            </select>
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium">
              École
            </label>
            <select
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
            >
              <option value="">Toutes les écoles</option>
              {schools.map((schoolItem) => (
                <option key={schoolItem.id} value={schoolItem.id}>
                  {schoolItem.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Filtres spécifiques pour les offres */}
      {activeTab === "offers" && (
        <div>
          <label htmlFor="offerType" className="block text-sm font-medium">
            Type d'offre
          </label>
          <select
            id="offerType"
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="mt-2 p-2 border rounded-md w-full"
          >
            <option value="">Tous</option>
            <option value="stage">Stage</option>
            <option value="alternance">Alternance</option>
          </select>
        </div>
      )}

      {/* Filtres spécifiques pour les entreprises */}
      {activeTab === "companies" && (
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Rechercher par nom"
            className="mt-2 p-2 border rounded-md w-full"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSearch}
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          Appliquer le filtre
        </Button>
        
        <Button
          onClick={resetFilters}
          variant="outline"
          className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default FilterBlock;
