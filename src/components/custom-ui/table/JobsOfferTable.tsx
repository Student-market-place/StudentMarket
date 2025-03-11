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
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import CompanyOfferService from "@/services/companyOffer.service";
import { useQueryClient } from "@tanstack/react-query";

interface JobsOfferTableProps {
  jobOffers: CompanyOfferWithRelation[];
  onDelete?: (id: string) => void;
}

type SortField =
  | "title"
  | "type"
  | "startDate"
  | "studentApplies"
  | "createdAt"
  | "status";
type SortDirection = "asc" | "desc";

export const JobsOfferTable = ({
  jobOffers,
  onDelete,
}: JobsOfferTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusSort] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getJobStatus = (job: CompanyOfferWithRelation) => {
    const now = new Date();
    const startDate = new Date(job.startDate);

    if (startDate > now && !job.deletedAt) {
      return "Open";
    } else {
      return "Closed";
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = jobOffers.filter((job) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return job.title.toLowerCase().includes(searchLower);
    });

    let sorted = [...filtered];

    if (sortField === "startDate" || sortField === "createdAt") {
      sorted = sorted.sort((a, b) => {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    } else if (sortField === "studentApplies") {
      sorted = sorted.sort((a, b) => {
        const appliesA = a.studentApplies?.length || 0;
        const appliesB = b.studentApplies?.length || 0;

        return sortDirection === "asc"
          ? appliesA - appliesB
          : appliesB - appliesA;
      });
    } else if (sortField === "title" || sortField === "type") {
      sorted = sorted.sort((a, b) => {
        const valueA = String(a[sortField] || "");
        const valueB = String(b[sortField] || "");

        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    if (sortField === "status") {
      sorted = sorted.sort((a, b) => {
        const statusA = getJobStatus(a);
        const statusB = getJobStatus(b);

        return sortDirection === "asc"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      });
    }

    return sorted;
  }, [jobOffers, searchTerm, sortField, sortDirection, statusSort]);

  const handleDelete = async (job: CompanyOfferWithRelation) => {
    try {
      await CompanyOfferService.deleteCompanyOffer(job.id);
      onDelete?.(job.id);
      await queryClient.invalidateQueries({ queryKey: ["company_offers"] });
    } catch (error) {
      console.error("Error deleting job offer:", error);
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
                      onClick={() => {
                        setSortField("status");
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        );
                      }}
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
                  filteredAndSortedData.map((job) => {
                    const status = getJobStatus(job);
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="w-[25%] font-medium">
                          {job.title}
                        </TableCell>
                        <TableCell className="w-[15%] text-center">
                          <Badge
                            variant={
                              job.type === "alternance"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              job.type === "alternance"
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
                          {job.studentApplies?.length || 0}
                        </TableCell>
                        <TableCell className="w-[10%] text-center">
                          <Badge
                            variant={
                              status === "Open" ? "success" : "secondary"
                            }
                            className={
                              status === "Open"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }
                          >
                            {status}
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
                              onClick={() => handleDelete(job)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
