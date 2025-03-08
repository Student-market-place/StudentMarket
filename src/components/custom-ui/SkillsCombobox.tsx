"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useEffect, useCallback } from "react";

const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface Skill {
  value: string;
  label: string;
}

interface SkillsComboboxProps {
  onSkillsChange: (skills: string[]) => void;
  defaultSkills?: string[];
}

export function SkillsCombobox({ onSkillsChange, defaultSkills = [] }: SkillsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultSkills);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  // Charger les skills depuis l'API au montage du composant
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skill');
        const data = await response.json();
        const formattedSkills = data.map((skill: { id: string; name: string }) => ({
          value: skill.id,
          label: skill.name,
        }));
        setSkills(formattedSkills);
      } catch (error) {
        console.error("Erreur lors du chargement des skills:", error);
      }
    };
    fetchSkills();
  }, []);

  // Gérer les changements de sélection
  const handleSelectionChange = useCallback((newValues: string[]) => {
    setSelectedValues(newValues);
    onSkillsChange(newValues);
  }, [onSkillsChange]);

  const filteredSkills = skills.filter(
    (skill) =>
      skill.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      skill.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!inputValue.trim()) return;

    try {
      const response = await fetch('/api/skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputValue.trim() }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création du skill');

      const newSkill = await response.json();
      const formattedSkill = {
        value: newSkill.id,
        label: newSkill.name,
      };

      setSkills((prev) => [...prev, formattedSkill]);
      handleSelectionChange([...selectedValues, formattedSkill.value]);
      setInputValue("");
    } catch (error) {
      console.error("Erreur lors de la création du skill:", error);
    }
  };

  return (
    <div>
      <style jsx global>
        {scrollbarHideClass}
      </style>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full max-w-[296px] h-10 px-3 justify-between"
          >
            <div
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
              style={{ maxWidth: "calc(100% - 20px)" }}
            >
              {selectedValues.length > 0 ? (
                selectedValues.map((selectedValue) => {
                  const skill = skills.find(
                    (s) => s.value === selectedValue
                  );
                  return (
                    <Badge
                      key={selectedValue}
                      variant="secondary"
                      className="shrink-0"
                    >
                      {skill?.label}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 rounded-full focus:ring-2 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectionChange(
                            selectedValues.filter((v) => v !== selectedValue)
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectionChange(
                              selectedValues.filter((v) => v !== selectedValue)
                            );
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">
                  Sélectionnez vos compétences...
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 space-y-2">
          <input
            type="text"
            placeholder="Rechercher une compétence..."
            className="w-full p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto scrollbar-hide">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill.value}
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => {
                    handleSelectionChange(
                      selectedValues.includes(skill.value)
                        ? selectedValues.filter((v) => v !== skill.value)
                        : [...selectedValues, skill.value]
                    );
                    setInputValue("");
                  }}
                >
                  {skill.label}
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedValues.includes(skill.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground p-2">
                <p>Aucune compétence trouvée.</p>
                {inputValue.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer &quot;{inputValue}&quot;
                  </Button>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
