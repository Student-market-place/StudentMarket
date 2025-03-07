"use client";

import { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpDown,
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

const students = [
  {
    firstName: "John",
    lastName: "Doe",
    school: "Springfield Elementary",
    status: "Internship",
    isAvailable: true,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    school: "Rydell High",
    status: "Apprenticeship",
    isAvailable: true,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    school: "Springfield Elementary",
    status: "Internship",
    isAvailable: false,
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    school: "Rydell High",
    status: "Apprenticeship",
    isAvailable: true,
  },
  {
    firstName: "Eve",
    lastName: "White",
    school: "Springfield Elementary",
    status: "Internship",
    isAvailable: false,
  },
  {
    firstName: "Max",
    lastName: "Black",
    school: "Rydell High",
    status: "Apprenticeship",
    isAvailable: false,
  },
  {
    firstName: "Sam",
    lastName: "Green",
    school: "Springfield Elementary",
    status: "Internship",
    isAvailable: false,
  },
  {
    firstName: "Lucy",
    lastName: "Grey",
    school: "Rydell High",
    status: "Apprenticeship",
    isAvailable: true,
  },
  {
    firstName: "Alex",
    lastName: "Blue",
    school: "Springfield Elementary",
    status: "Internship",
    isAvailable: true,
  },
  {
    firstName: "Mary",
    lastName: "Red",
    school: "Rydell High",
    status: "Apprenticeship",
    isAvailable: false,
  },
];

type SortField = "fullName" | "school" | "status" | "isAvailable";
type SortDirection = "asc" | "desc";

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("fullName");
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
    const filtered = students.filter((student) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

      // Only search by name and school
      return (
        fullName.includes(searchLower) ||
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.school.toLowerCase().includes(searchLower)
      );
    });

    return [...filtered].sort((a, b) => {
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
            placeholder="Search by name or school..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-hidden">
          <div className="overflow-hidden">
            <Table className="table-fixed border-collapse">
              <TableHeader className="sticky top-0 z-10 bg-muted/50">
                <TableRow>
                  <TableHead className="w-[35%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("fullName")}
                    >
                      <span>Name</span>
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
                  <TableHead className="w-[25%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("school")}
                    >
                      <span>School</span>
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
                      <span>Status</span>
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
                      <span>Availability</span>
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
                  <TableHead className="w-[10%] text-center font-medium">
                    Actions
                  </TableHead>
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

                      No students found matching &quot;{searchTerm}&quot;.

                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((student, index) => (
                    <TableRow
                      key={`${student.firstName}-${student.lastName}-${index}`}
                    >
                      <TableCell className="w-[35%] font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="w-[25%]">
                        {student.school}
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        <Badge
                          variant={
                            student.status === "Internship"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            student.status === "Internship"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {student.status}
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
                          {student.isAvailable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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
