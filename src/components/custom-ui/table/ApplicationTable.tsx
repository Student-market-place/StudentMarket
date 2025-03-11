"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpDown,
  Eye,
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
import { useRouter } from "next/navigation";

import StudentService from "@/services/student.service";
import { StudentApplyWithRelations } from "@/services/studentApply.service";
import { Apply_Status } from "@prisma/client";

interface ApplicationTableProps {
  studentId: string;
}

type SortField = "title" | "company" | "type" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

export function ApplicationTable({ studentId }: ApplicationTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [applications, setApplications] = useState<StudentApplyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(true);
        const data = await StudentService.fetchStudentApplications(studentId);
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des candidatures:", err);
        setError("Une erreur est survenue lors du chargement des candidatures.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [studentId]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Fonction pour obtenir la classe de couleur du badge selon le statut
  const getStatusBadgeClass = (status: Apply_Status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepte':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'refuse':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fonction pour traduire le statut
  const getStatusLabel = (status: Apply_Status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'accepte':
        return 'Acceptée';
      case 'refuse':
        return 'Refusée';
      default:
        return status;
    }
  };

  const filteredAndSortedData = useMemo(() => {
    // Filtre les applications
    const filtered = applications.filter((application) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();

      return (
        (application.companyOffer?.title || "").toLowerCase().includes(searchLower) ||
        (application.companyOffer?.company?.name || "").toLowerCase().includes(searchLower)
      );
    });

    // Trie les applications
    return [...filtered].sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (sortField === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortField === "title") {
        const titleA = a.companyOffer?.title || "";
        const titleB = b.companyOffer?.title || "";
        return sortDirection === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      } else if (sortField === "company") {
        const companyA = a.companyOffer?.company?.name || "";
        const companyB = b.companyOffer?.company?.name || "";
        return sortDirection === "asc"
          ? companyA.localeCompare(companyB)
          : companyB.localeCompare(companyA);
      } else if (sortField === "type") {
        const typeA = a.companyOffer?.type || "";
        const typeB = b.companyOffer?.type || "";
        return sortDirection === "asc"
          ? typeA.localeCompare(typeB)
          : typeB.localeCompare(typeA);
      }
      return 0;
    });
  }, [searchTerm, sortField, sortDirection, applications]);

  if (loading) {
    return (
      <div className="space-y-4 p-12">
        <div className="text-center py-10">
          Chargement des candidatures...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-12">
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-12">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher par titre ou entreprise..."
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
                      <span>Titre</span>
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
                      <span>Entreprise</span>
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
                  <TableHead className="w-[15%]">
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
                  <TableHead className="w-[15%]">
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
                  <TableHead className="w-[15%]">
                    <Button
                      variant="ghost"
                      className="h-7 p-0 hover:bg-transparent font-medium"
                      onClick={() => handleSort("createdAt")}
                    >
                      <span>Date</span>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm 
                        ? `Aucune candidature trouvée pour "${searchTerm}".`
                        : "Vous n'avez pas encore de candidature."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="w-[25%] font-medium">
                        {application.companyOffer?.title || "Offre non disponible"}
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {application.companyOffer?.company?.name || "Entreprise inconnue"}
                      </TableCell>
                      <TableCell className="w-[15%]">
                        <Badge
                          variant="outline"
                        >
                          {application.companyOffer?.type || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%]">
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(application.status)}
                        >
                          {getStatusLabel(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[15%]">
                        {formatDate(application.createdAt)}
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => router.push(`/application/${application.id}`)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => router.push(`/offer/${application.companyOfferId}`)}
                            title="Voir l'offre"
                          >
                            <Pencil className="h-4 w-4" />
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
