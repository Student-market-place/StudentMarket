"use client";

import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpDown,
  Trash2,
  Pencil,
} from "lucide-react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentWithRelation } from "@/types/student.type";
import StudentService from "@/services/student.service";
import { UpdateStudent } from "../UpdateStudent";
import { CreateStudent } from "../CreateStudent";

type SortField = "fullName" | "school" | "status" | "isAvailable";
type SortDirection = "asc" | "desc";

export function AllStudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => StudentService.fetchStudents({}),
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
    const filtered = [...students].filter((student) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();

      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const schoolName =
        typeof student.school === "object"
          ? student.school?.name || ""
          : String(student.school || "");

      return (
        fullName.includes(searchLower) ||
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        schoolName.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      if (sortField === "fullName") {
        const fullNameA = `${a.firstName} ${a.lastName}`;
        const fullNameB = `${b.firstName} ${b.lastName}`;
        return sortDirection === "asc"
          ? fullNameA.localeCompare(fullNameB)
          : fullNameB.localeCompare(fullNameA);
      } else if (sortField === "isAvailable") {
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
      } else if (sortField === "school") {
        // Pour les étudiants de l'API, school peut être un objet
        const schoolA =
          typeof a.school === "object"
            ? a.school?.name || ""
            : String(a.school || "");
        const schoolB =
          typeof b.school === "object"
            ? b.school?.name || ""
            : String(b.school || "");

        return sortDirection === "asc"
          ? schoolA.localeCompare(schoolB)
          : schoolB.localeCompare(schoolA);
      } else {
        const valueA = String(a[sortField] || "");
        const valueB = String(b[sortField] || "");

        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  }, [searchTerm, sortField, sortDirection, students]);

  const handleDelete = async (student: StudentWithRelation) => {
    try {
      await StudentService.deleteStudent(student.id);
      await queryClient.invalidateQueries({ queryKey: ["students"] });
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
            placeholder="Rechercher par nom ou école..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreateStudent />
      </div>

      <div className="rounded-md border">
        <div className="overflow-hidden">
          <div className="overflow-hidden">
            <Table className="table-fixed border-collapse">
              <TableHeader className="sticky top-0 z-10 bg-muted/50">
                <TableRow>
                  <TableHead className="w-[30%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("fullName")}
                    >
                      <span>Nom</span>
                      {sortField === "fullName" ? (
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
                  <TableHead className="w-[20%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("school")}
                    >
                      <span>École</span>
                      {sortField === "school" ? (
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
                  <TableHead className="w-[15%] text-center">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("status")}
                    >
                      <span>Statut</span>
                      {sortField === "status" ? (
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
                  <TableHead className="w-[15%] text-center">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("isAvailable")}
                    >
                      <span>Disponibilité</span>
                      {sortField === "isAvailable" ? (
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
                  <TableHead className="w-[20%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            <Table className="table-fixed border-collapse">
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Aucun étudiant trouvé correspondant à &quot;{searchTerm}
                      &quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((student, index) => (
                    <TableRow
                      key={`${student.firstName}-${student.lastName}-${index}`}
                    >
                      <TableCell className="w-[30%] font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {typeof student.school === "object"
                          ? student.school?.name
                          : student.school}
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        <Badge
                          variant={
                            student.status === "stage" ? "default" : "secondary"
                          }
                          className={
                            student.status === "stage"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {student.status === "stage"
                            ? "Stage"
                            : student.status === "alternance"
                              ? "Alternance"
                              : String(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        <Badge
                          variant={
                            student.isAvailable ? "success" : "secondary"
                          }
                          className={
                            student.isAvailable
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }
                        >
                          {student.isAvailable ? "Oui" : "Non"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[20%] text-center">
                        <div className="flex justify-center">
                          <UpdateStudent student={student} />
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
                                  Êtes-vous sûr de vouloir supprimer cet
                                  étudiant ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée. Toutes
                                  les données liées à cet étudiant seront
                                  perdues.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(student)}
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
