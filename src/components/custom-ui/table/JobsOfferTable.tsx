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

const jobOffers = [
  {
    title: "Software Developer",
    type: "Internship",
    startDate: "2022-06-01",
    studentApplies: 3,
    status: "Closed",
    createdAt: "2022-05-15",
  },
  {
    title: "Data Analyst",
    type: "Apprenticeship",
    startDate: "2022-09-15",
    studentApplies: 1,
    status: "Open",
    createdAt: "2022-08-20",
  },
  {
    title: "Cybersecurity Engineer",
    type: "Internship",
    startDate: "2023-01-10",
    studentApplies: 5,
    status: "Closed",
    createdAt: "2022-12-01",
  },
  {
    title: "Machine Learning Engineer",
    type: "Internship",
    startDate: "2023-06-01",
    studentApplies: 2,
    status: "Open",
    createdAt: "2023-04-15",
  },
  {
    title: "Cloud Engineer",
    type: "Apprenticeship",
    startDate: "2023-10-15",
    studentApplies: 4,
    status: "Closed",
    createdAt: "2023-09-01",
  },
  {
    title: "Frontend Developer",
    type: "Internship",
    startDate: "2024-01-05",
    studentApplies: 6,
    status: "Open",
    createdAt: "2023-11-20",
  },
  {
    title: "Backend Developer",
    type: "Apprenticeship",
    startDate: "2024-05-20",
    studentApplies: 3,
    status: "Closed",
    createdAt: "2024-03-01",
  },
  {
    title: "UI/UX Designer",
    type: "Internship",
    startDate: "2024-09-01",
    studentApplies: 2,
    status: "Open",
    createdAt: "2024-07-10",
  },
  {
    title: "Blockchain Developer",
    type: "Apprenticeship",
    startDate: "2024-12-10",
    studentApplies: 1,
    status: "Closed",
    createdAt: "2024-10-01",
  },
  {
    title: "DevOps Engineer",
    type: "Internship",
    startDate: "2025-03-01",
    studentApplies: 5,
    status: "Open",
    createdAt: "2025-01-15",
  },
];

type SortField =
  | "title"
  | "type"
  | "startDate"
  | "studentApplies"
  | "status"
  | "createdAt";
type SortDirection = "asc" | "desc";

export const JobsOfferTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = jobOffers.filter((job) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();

      return job.title.toLowerCase().includes(searchLower);
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "startDate" || sortField === "createdAt") {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (sortField === "studentApplies") {
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
            placeholder="Search by job title..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="default" className="cursor-pointer">
          New
        </Button>
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
                  <TableHead className="w-[10%] text-center">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("studentApplies")}
                    >
                      <span>Applies</span>
                      {sortField === "studentApplies" ? (
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
                  <TableHead className="w-[10%] text-center">
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
                      onClick={() => handleSort("createdAt")}
                    >
                      <span>Created At</span>
                      {sortField === "createdAt" ? (
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No job offers found matching &quot;{searchTerm}&quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((job, index) => (
                    <TableRow key={`${job.title}-${job.createdAt}-${index}`}>
                      <TableCell className="w-[25%] font-medium">
                        {job.title}
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        <Badge
                          variant={
                            job.type === "Internship" ? "default" : "secondary"
                          }
                          className={
                            job.type === "Internship"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {job.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        {formatDate(job.startDate)}
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        {job.studentApplies}
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <Badge
                          variant={
                            job.status === "Open" ? "success" : "secondary"
                          }
                          className={
                            job.status === "Open"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%] text-center">
                        {formatDate(job.createdAt)}
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
};
