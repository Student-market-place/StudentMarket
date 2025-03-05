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

const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const initialFrameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function SkillsCombobox() {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [frameworks, setFrameworks] = React.useState(initialFrameworks);
  const [inputValue, setInputValue] = React.useState("");

  const filteredFrameworks = frameworks.filter(
    (framework) =>
      framework.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      framework.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleCreateNew = () => {
    if (!inputValue.trim()) return;

    const newValue = inputValue.trim().toLowerCase().replace(/\s+/g, "-");
    const newLabel = inputValue.trim();

    if (frameworks.some((f) => f.value === newValue)) return;

    const newFramework = { value: newValue, label: newLabel };
    setFrameworks((prev) => [...prev, newFramework]);
    setSelectedValues((prev) => [...prev, newValue]);
    setInputValue("");
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
            className="w-[200px] h-10 px-3 justify-between"
          >
            <div
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
              style={{ maxWidth: "calc(100% - 20px)" }}
            >
              {selectedValues.length > 0 ? (
                selectedValues.map((selectedValue) => {
                  const framework = frameworks.find(
                    (f) => f.value === selectedValue
                  );
                  return (
                    <Badge
                      key={selectedValue}
                      variant="secondary"
                      className="shrink-0"
                    >
                      {framework?.label}
                      <button
                        className="ml-1 rounded-full focus:ring-2"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedValues((prev) =>
                            prev.filter((v) => v !== selectedValue)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">
                  Select frameworks...
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 space-y-2">
          <input
            type="text"
            placeholder="Search framework..."
            className="w-full p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto scrollbar-hide">
            {filteredFrameworks.length > 0 ? (
              filteredFrameworks.map((framework) => (
                <div
                  key={framework.value}
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => {
                    setSelectedValues((prev) =>
                      prev.includes(framework.value)
                        ? prev.filter((v) => v !== framework.value)
                        : [...prev, framework.value]
                    );
                    setInputValue("");
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedValues.includes(framework.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground p-2">
                <p>No framework found.</p>
                {inputValue.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create &quot;{inputValue}&quot;
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
