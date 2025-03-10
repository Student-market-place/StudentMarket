"use client";

import { useState, useMemo, useEffect } from "react";
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
import { fetchStudentsApply } from "@/services/studentApply.service";
import axios from "axios";
import { StudentApply } from "@/types/studentApply.type";
import { CompanyOffer } from "@/types/companyOffer.type";

const applicationsFix = [
  {
    title: "Software Developer",
    company: "Google",
    type: "Internship",
    startDate: "2022-06-01",
    endDate: "2022-08-31",
  },
  {
    title: "Data Analyst",
    company: "Microsoft",
    type: "Apprenticeship",
    startDate: "2022-09-15",
    endDate: "2023-09-14",
  },
  {
    title: "Cybersecurity Engineer",
    company: "IBM",
    type: "Internship",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
  },
  {
    title: "Machine Learning Engineer",
    company: "Meta",
    type: "Internship",
    startDate: "2024-01-10",
    endDate: "2024-04-10",
  },
  {
    title: "Cloud Engineer",
    company: "Amazon",
    type: "Apprenticeship",
    startDate: "2024-05-01",
    endDate: "2025-03-01",
  },
  {
    title: "Frontend Developer",
    company: "Netflix",
    type: "Internship",
    startDate: "2025-03-10",
    endDate: null,
  },
];

type SortField = "title" | "company" | "type" | "startDate" | "endDate";
type SortDirection = "asc" | "desc";

export function ApplicationTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("endDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [applications, setApplications] = useState<StudentApply[]>([]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await fetchStudentsApply();
        setApplications(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    }

    loadApplications();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Ongoing";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = applications.filter((application) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();

      return (
        application.companyOffer.title.toLowerCase().includes(searchLower) ||
        application.companyOffer.company.name
          .toLowerCase()
          .includes(searchLower)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "startDate" || sortField === "endDate") {
        const dateA = new Date(a.companyOffer[sortField] || "");
        const dateB = new Date(b.companyOffer[sortField] || "");

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        const fieldA = a.companyOffer[sortField];
        const fieldB = b.companyOffer[sortField];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortDirection === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        } else {
          return 0; // or handle other types if necessary
        }
      }
    });
  }, [searchTerm, sortField, sortDirection, applications]);

  return (
    <div className="space-y-4 p-12">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search by title or company..."
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
                  <TableHead className="w-[25%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("title")}
                    >
                      <span>Title</span>
                      {sortField === "title" ? (
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
                      onClick={() => handleSort("company")}
                    >
                      <span>Company</span>
                      {sortField === "company" ? (
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
                      onClick={() => handleSort("type")}
                    >
                      <span>Type</span>
                      {sortField === "type" ? (
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
                      onClick={() => handleSort("startDate")}
                    >
                      <span>Start Date</span>
                      {sortField === "startDate" ? (
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
                      onClick={() => handleSort("endDate")}
                    >
                      <span>End Date</span>
                      {sortField === "endDate" ? (
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No applications found matching &quot;{searchTerm}&quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((application, index) => (
                    <TableRow
                      key={`${application.companyOffer.title}-${application.companyOffer.company}-${index}`}
                    >
                      <TableCell className="w-[25%] font-medium">
                        {application.companyOffer.title}
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {application.companyOffer.company.name}
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        <Badge
                          variant={
                            application.companyOffer.type === "stage"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            application.companyOffer.type === "stage"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {application.companyOffer.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        {formatDate(application.companyOffer.startDate)}
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        {application.companyOffer.endDate ? (
                          formatDate(application.companyOffer.endDate)
                        ) : (
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Ongoing
                          </Badge>
                        )}
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
