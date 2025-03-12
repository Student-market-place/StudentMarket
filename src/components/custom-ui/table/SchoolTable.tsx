"use client";
import { CreateSchool } from "@/components/custom-ui/CreateSchool";
import { UpdateSchool } from "@/components/custom-ui/UpdateSchool";
import { useState, useMemo, useEffect } from "react";
import { Trash2, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { School } from "@/types/school.type";
import SchoolService from "@/services/school.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { ChevronDown, ChevronUp } from "lucide-react";
import { SchoolResponseDto } from "@/types/dto/school.dto";

type SortField = "name" | "domainName" | "students" | "isActive";
type SortDirection = "asc" | "desc";

export function SchoolTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [schools, setSchools] = useState<SchoolResponseDto[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Récupération des écoles depuis l'API
    SchoolService.fetchSchools()
      .then((data) => {
        setSchools(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des écoles:", error);
      });
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedSchools = (() => {
    const filtered = schools.filter((school) => {
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        school.name.toLowerCase().includes(searchLower) ||
        school.domainName.toLowerCase().includes(searchLower) ||
        (school.studentCount !== undefined
          ? school.studentCount.toString()
          : "0"
        ).includes(searchTerm) ||
        (school.isActive ? "yes" : "no").includes(searchLower)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "students") {
        const aCount = a.studentCount !== undefined ? a.studentCount : 0;
        const bCount = b.studentCount !== undefined ? b.studentCount : 0;
        return sortDirection === "asc" ? aCount - bCount : bCount - aCount;
      } else if (sortField === "isActive") {
        return sortDirection === "asc"
          ? a[sortField] === b[sortField]
            ? 0
            : a[sortField]
            ? -1
            : 1
          : a[sortField] === b[sortField]
          ? 0
          : a[sortField]
          ? 1
          : -1;
      } else {
        const valueA = a[sortField]?.toString().toLowerCase() || "";
        const valueB = b[sortField]?.toString().toLowerCase() || "";
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  })();

  const handleDelete = async (schoolId: string) => {
    try {
      await SchoolService.deleteSchool(schoolId);
      await queryClient.invalidateQueries({ queryKey: ["schools"] });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'école:", error);
    }
  };

  return (
    <div className="space-y-4 p-12">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une école..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreateSchool />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[30%] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nom
                  {sortField === "name" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="w-[30%] cursor-pointer"
                onClick={() => handleSort("domainName")}
              >
                <div className="flex items-center">
                  Domaine
                  {sortField === "domainName" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("students")}
              >
                <div className="flex items-center justify-center">
                  Étudiants
                  {sortField === "students" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center justify-center">
                  Actif
                  {sortField === "isActive" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )
                  ) : null}
                </div>
              </TableHead>
              <TableHead className="w-[15%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xl text-gray-400">
                      Aucune école trouvée
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Essayez de changer vos critères de recherche
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.domainName}</TableCell>
                  <TableCell className="text-center">
                    {school.studentCount !== undefined ? school.studentCount : 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={school.isActive ? "success" : "destructive"}
                      className="w-16 justify-center"
                    >
                      {school.isActive ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[20%] text-center">
                    <div className="flex justify-center">
                      <UpdateSchool school={school} />
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
                              Êtes-vous sûr de vouloir supprimer cette école ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible et supprimera
                              définitivement l&apos;école et tous ses étudiants
                              associés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(school.id)}
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
  );
}
