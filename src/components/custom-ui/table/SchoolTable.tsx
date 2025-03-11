"use client";
import { CreateSchool } from "@/components/custom-ui/CreateSchool";
import { UpdateSchool } from "@/components/custom-ui/UpdateSchool";
import { useState, useMemo } from "react";
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

type SortField = "name" | "domainName" | "students" | "isActive";
type SortDirection = "asc" | "desc";

export function SchoolTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const queryClient = useQueryClient();

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: SchoolService.fetchSchools,
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
    if (!schools.length) return [];

    const filtered = schools.filter((school) => {
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        school.name.toLowerCase().includes(searchLower) ||
        school.domainName.toLowerCase().includes(searchLower) ||
        (Array.isArray(school.students)
          ? school.students.length.toString()
          : "0"
        ).includes(searchTerm) ||
        (school.isActive ? "yes" : "no").includes(searchLower)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "students") {
        const aCount = Array.isArray(a.students) ? a.students.length : 0;
        const bCount = Array.isArray(b.students) ? b.students.length : 0;
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
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });
  }, [searchTerm, sortField, sortDirection, schools]);

  const handleDelete = async (school: School) => {
    try {
      await SchoolService.deleteSchool(school);
      await queryClient.invalidateQueries({ queryKey: ["schools"] });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'école:", error);
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
            placeholder="Search Schools"
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreateSchool />
      </div>

      <div className="rounded-md border">
        <div className="overflow-hidden">
          <Table className="table-fixed border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-muted/50">
              <TableRow>
                <TableHead className="w-[25%]">
                  <Button
                    variant="ghost"
                    className="h-7 p-0 hover:bg-transparent font-medium"
                    onClick={() => handleSort("name")}
                  >
                    <span>School</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </TableHead>
                <TableHead className="w-[25%]">
                  <Button
                    variant="ghost"
                    className="h-7 p-0 hover:bg-transparent font-medium"
                    onClick={() => handleSort("domainName")}
                  >
                    <span>Domain</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%] text-center">
                  <Button
                    variant="ghost"
                    className="h-7 p-0 hover:bg-transparent font-medium"
                    onClick={() => handleSort("students")}
                  >
                    <span>Number of Students</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%] text-center">
                  <Button
                    variant="ghost"
                    className="h-7 p-0 hover:bg-transparent font-medium"
                    onClick={() => handleSort("isActive")}
                  >
                    <span>In Partnership</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%] text-center font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center font-medium text-gray-500"
                  >
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No schools found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((school) => (
                  <TableRow key={school.name}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.domainName}</TableCell>
                    <TableCell className="text-center">
                      {Array.isArray(school.students)
                        ? school.students.length
                        : 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={school.isActive ? "success" : "secondary"}
                      >
                        {school.isActive ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <UpdateSchool id={school.id} school={school} />
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
                              Cette action ne peut pas être annulée. Toutes les
                              données liées à cette école seront perdues.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(school)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
