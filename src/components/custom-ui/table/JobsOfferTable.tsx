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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import CompanyOfferService from "@/services/companyOffer.service";

interface JobsOfferTableProps {
  jobOffers: CompanyOfferWithRelation[];
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
  jobOffers: initialJobOffers,
}: JobsOfferTableProps) => {
  const [jobOffers, setJobOffers] =
    useState<CompanyOfferWithRelation[]>(initialJobOffers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusSort, setStatusSort] = useState<"asc" | "desc">("asc");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusSort = () => {
    setStatusSort(statusSort === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Determine job status based on dates
  const getJobStatus = (job: CompanyOfferWithRelation) => {
    const now = new Date();
    const startDate = new Date(job.startDate);

    // If start date is in the future and not deleted, job is open
    if (startDate > now && !job.deletedAt) {
      return "Open";
    } else {
      return "Closed";
    }
  };

  // Fonction pour ouvrir la boîte de dialogue de confirmation de suppression
  const openDeleteDialog = (jobId: string) => {
    setDeletingJobId(jobId);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  // Fonction pour fermer la boîte de dialogue
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingJobId(null);
    setDeleteError(null);
  };

  // Fonction pour gérer la suppression d'une offre
  // Fonction pour gérer la suppression d'une offre
  const handleDeleteJobOffer = async () => {
    if (!deletingJobId) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      // Find the full company offer object by ID
      const offerToDelete = jobOffers.find(
        (offer) => offer.id === deletingJobId
      );

      if (!offerToDelete) {
        throw new Error("Job offer not found");
      }

      // Appel du service de suppression avec l'objet complet
      await CompanyOfferService.deleteCompanyOffer(offerToDelete);

      // Mise à jour locale de l'état sans refaire d'appel API
      setJobOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.id !== deletingJobId)
      );

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting job offer:", error);
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete job offer"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = jobOffers.filter((job) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return job.title.toLowerCase().includes(searchLower);
    });

    let sorted = [...filtered];

    // Tri en fonction du champ sélectionné
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

    // Si on trie par statut, on applique le tri après (car c'est une propriété calculée)
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
                  filteredAndSortedData.map((job, index) => {
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
                              onClick={() => openDeleteDialog(job.id)}
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

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job offer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <div className="text-sm font-medium text-destructive mt-2">
              {deleteError}
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteJobOffer}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
