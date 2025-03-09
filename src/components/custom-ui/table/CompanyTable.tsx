"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const companies = [
  {
    name: "Springfield Company",
    companyOffers: 120,
  },
  {
    name: "Shelbyville Company",
    companyOffers: 80,
  },
  {
    name: "Ogdenville Company",
    companyOffers: 50,
  },
  {
    name: "North Haverbrook Company",
    companyOffers: 30,
  },
  {
    name: "Capital City Company",
    companyOffers: 20,
  },
  {
    name: "Waverly Hills Company",
    companyOffers: 10,
  },
  {
    name: "Little Pwagmattasquarmsettport Company",
    companyOffers: 5,
  },
  {
    name: "New New York Company",
    companyOffers: 2,
  },
];

type SortField = "name" | "companyOffers";
type SortDirection = "asc" | "desc";

export function CompanyTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = companies.filter((company) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        company.name.toLowerCase().startsWith(searchLower) ||
        company.companyOffers.toString().startsWith(searchTerm)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "companyOffers") {
        return sortDirection === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else {
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });
  }, [searchTerm, sortField, sortDirection]);

  return (
    <div className="space-y-4 p-12">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search Companies"
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-hidden">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-muted/50 border-b">
            <Table className="table-fixed border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%] px-4">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("name")}
                    >
                      <span>Company</span>
                      {sortField === "name" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[20%] px-4 text-center">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("companyOffers")}
                    >
                      <span>Offers</span>
                      {sortField === "companyOffers" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[20%] px-4 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Body */}
          <div className="max-h-[350px] overflow-y-auto">
            <Table className="table-fixed border-collapse">
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">

                      No companies found starting with &quot;{searchTerm}&quot;.

                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((company) => (
                    <TableRow key={company.name}>
                      <TableCell className="w-[60%] px-4 font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell className="w-[20%] px-4 text-center">
                        {company.companyOffers}
                      </TableCell>
                      <TableCell className="w-[20%] px-4 text-center">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
