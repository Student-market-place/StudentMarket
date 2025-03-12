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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyService from "@/services/company.service";
import { Company, CompanyWithRelation } from "@/types/company.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateCompany } from "../CreateCompany";
import UpdateCompany from "../UpdateCompany";

type SortField = "name" | "email" | "offers";
type SortDirection = "asc" | "desc";

export function CompanyTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery<CompanyWithRelation[]>({
    queryKey: ["companies"],
    queryFn: CompanyService.fetchCompanies,
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    return [...companies]
      .filter((company) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
          company.name.toLowerCase().includes(searchLower) ||
          company.user.email.toLowerCase().includes(searchLower) ||
          (company._count?.companyOffers || 0).toString().includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (sortField === "offers") {
          const aCount = a._count?.companyOffers || 0;
          const bCount = b._count?.companyOffers || 0;
          return sortDirection === "asc" ? aCount - bCount : bCount - aCount;
        } else if (sortField === "email") {
          return sortDirection === "asc"
            ? a.user.email.localeCompare(b.user.email)
            : b.user.email.localeCompare(a.user.email);
        } else {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });
  }, [searchTerm, sortField, sortDirection, companies]);

  const handleDelete = async (company: CompanyWithRelation) => {
    try {
      const companyToDelete: Company = {
        id: company.id,
        name: company.name,
        description: company.description,
        profilePictureId: company.profilePicture?.id || "",
        userId: company.user.id,
        createdAt: company.createdAt,
        modifiedAt: company.modifiedAt,
        deletedAt: company.deletedAt || new Date(),
      };

      await CompanyService.deleteCompany(companyToDelete);
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

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
        <CreateCompany />
      </div>

      <div className="rounded-md border">
        <div className="overflow-hidden">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-muted/50 border-b">
            <Table className="table-fixed border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] px-4">
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
                  <TableHead className="w-[30%] px-4">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("email")}
                    >
                      <span>Email</span>
                      {sortField === "email" ? (
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
                  <TableHead className="w-[15%] px-4 text-center">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("offers")}
                    >
                      <span>Offers</span>
                      {sortField === "offers" ? (
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
                  <TableHead className="w-[15%] px-4 text-center">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center font-medium text-gray-500"
                    >
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No companies found starting with &quot;{searchTerm}&quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="w-[40%] px-4 font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell className="w-[30%] px-4">
                        {company.user.email}
                      </TableCell>
                      <TableCell className="w-[15%] px-4 text-center">
                        {company._count?.companyOffers || 0}
                      </TableCell>
                      <TableCell className="w-[15%] px-4 text-center">
                        <div className="flex justify-center">
                          <UpdateCompany company={company} id={company.id} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Êtes-vous sûr de vouloir supprimer cette école
                                  ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée. Toutes
                                  les données liées à cette école seront
                                  perdues.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(company)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
