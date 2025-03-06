"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FilterBlock = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState("");
  const [contractType, setContractType] = useState("");
  const [skills, setSkills] = useState("");
  const [school, setSchool] = useState("");

  // Listes des compétences et écoles pour le filtrage
  const skillsList = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "Python",
    "PHP",
    "Ruby",
  ];

  const schoolsList = [
    "ESD Bordeaux",
    "Université de Bordeaux",
    "École 42",
    "Sup’Internet",
    "HETIC",
  ];

  const handleSearch = () => {
    // Logique de recherche ou de filtrage à ajouter ici
    console.log("Recherche:", searchQuery);
    console.log("Disponibilité:", availability);
    console.log("Type de contrat:", contractType);
    console.log("Compétences:", skills);
    console.log("École:", school);
  };

  return (
    <div className="p-6 bg-white shadow-md border border-secondary shadow-t-lg rounded-md space-y-4 h-fit">
      <h2 className="text-xl font-semibold">Filtrer les résultats</h2>

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
          <option value="">Sélectionner une disponibilité</option>
          <option value="dispo">Disponible</option>
          <option value="non_dispo">Non Disponible</option>
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
          <option value="">Sélectionner un type de contrat</option>
          <option value="stage">Stage</option>
          <option value="alternance">Alternance</option>
        </select>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium">
          Compétences
        </label>
        <select
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="mt-2 p-2 border rounded-md w-full"
        >
          <option value="">Sélectionner une compétence</option>
          {skillsList.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
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
          <option value="">Sélectionner une école</option>
          {schoolsList.map((schoolItem) => (
            <option key={schoolItem} value={schoolItem}>
              {schoolItem}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
      >
        Appliquer le filtre
      </Button>
    </div>
  );
};

export default FilterBlock;
