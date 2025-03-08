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
import { Skill } from "@prisma/client";
import SkillService from "@/services/skill.service";
import { useQueryClient } from "@tanstack/react-query";

const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface SkillsComboboxProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills?: Skill[];
}

export function SkillsCombobox({
  selectedSkills,
  onSkillsChange,
  availableSkills = [],
}: SkillsComboboxProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [skills, setSkills] = React.useState(availableSkills);
  const [inputValue, setInputValue] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  // Update skills when availableSkills changes
  React.useEffect(() => {
    setSkills(availableSkills);
  }, [availableSkills]);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!inputValue.trim() || isCreating) return;

    const newSkillName = inputValue.trim();

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.toLowerCase()))
      return;

    try {
      setIsCreating(true);
      // Create the skill in the database
      const newSkill = await SkillService.postSkill({
        name: newSkillName,
        createdAt: new Date(),
        modifiedAt: new Date(),
        deletedAt: null,
        id: `temp-${Date.now()}`, // This will be replaced by the server
      });

      // Update the local state
      setSkills((prev) => [...prev, newSkill]);
      onSkillsChange([...selectedSkills, newSkill.id]);
      setInputValue("");

      // Refresh the skills list in React Query cache
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    } catch (error) {
      console.error("Failed to create skill:", error);
    } finally {
      setIsCreating(false);
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
              {selectedSkills.length > 0 ? (
                selectedSkills.map((selectedId) => {
                  const skill = skills.find((s) => s.id === selectedId);
                  return (
                    <Badge
                      key={selectedId}
                      variant="secondary"
                      className="shrink-0"
                    >
                      {skill?.name || "Compétence inconnue"}
                      <div
                        role="button"
                        tabIndex={0}
                        className="ml-1 rounded-full focus:ring-2 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSkillsChange(
                            selectedSkills.filter((id) => id !== selectedId)
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSkillsChange(
                              selectedSkills.filter((id) => id !== selectedId)
                            );
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </div>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">
                  Sélectionner des compétences...
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
                  key={skill.id}
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => {
                    onSkillsChange(
                      selectedSkills.includes(skill.id)
                        ? selectedSkills.filter((id) => id !== skill.id)
                        : [...selectedSkills, skill.id]
                    );
                    setInputValue("");
                  }}
                >
                  {skill.name}
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedSkills.includes(skill.id)
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
                    disabled={isCreating}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isCreating ? "Création..." : `Créer "${inputValue}"`}
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
