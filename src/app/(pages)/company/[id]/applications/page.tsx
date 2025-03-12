"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, CheckCircle, XCircle } from "lucide-react";

import CompanyService from "@/services/company.service";
import StudentApplyService from "@/services/studentApply.service";
import { toast } from "sonner";
import { Apply_Status } from "@prisma/client";
import { StudentApplyResponseDto } from "@/types/dto/student-apply.dto";
import { Input } from "@/components/ui/input";

// Composant de chargement
const ApplicationsLoading = () => (
  <div className="container mx-auto p-6 space-y-6">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-4 w-1/2" />
    
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

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

// Formatage de la date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const CompanyApplicationsPage = () => {
  const { id: companyId } = useParams() as { id: string };
  const router = useRouter();
  const [applications, setApplications] = useState<StudentApplyResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Vérifier si l'utilisateur est connecté
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError("Vous devez être connecté pour accéder à cette page.");
          setLoading(false);
          return;
        }
        
        // Vérifier si l'utilisateur est bien propriétaire de l'entreprise
        const company = await CompanyService.fetchCompany(companyId);
        if (!company || company.userId !== userId) {
          setError("Vous n'êtes pas autorisé à accéder à cette page.");
          setLoading(false);
          return;
        }
        
        // Récupérer les candidatures pour l'entreprise
        const applications = await StudentApplyService.searchStudentApplies({
          companyId: companyId
        });
        setApplications(applications);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des candidatures.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId]);

  // Filtrer les applications selon le terme de recherche
  const filteredApplications = applications.filter(application => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (application.student?.firstName || "").toLowerCase().includes(searchLower) ||
      (application.student?.lastName || "").toLowerCase().includes(searchLower) ||
      (application.companyOffer?.title || "").toLowerCase().includes(searchLower)
    );
  });

  const updateApplicationStatus = async (applicationId: string, status: Apply_Status) => {
    try {
      await StudentApplyService.updateStudentApplyStatus(applicationId, status);
      
      // Mettre à jour l'état local
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast.success(`Le statut de la candidature a été mis à jour avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du statut.");
    }
  };

  if (loading) {
    return <ApplicationsLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push(`/company/${companyId}/settings`)}>
            Retour aux paramètres
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidatures reçues</h1>
        <p className="text-gray-500 mt-1">
          Gérez les candidatures reçues pour vos offres d'emploi
        </p>
      </div>
      
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="Rechercher un candidat ou une offre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4 pr-4 py-2 w-full"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
          <CardDescription>
            {filteredApplications.length === 0 
              ? "Aucune candidature trouvée" 
              : `${filteredApplications.length} candidature${filteredApplications.length > 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune candidature à afficher</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Candidat</TableHead>
                    <TableHead className="w-[25%]">Offre</TableHead>
                    <TableHead className="w-[20%]">Date de candidature</TableHead>
                    <TableHead className="w-[15%]">Statut</TableHead>
                    <TableHead className="w-[20%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map(application => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.student ? (
                          <span>
                            {application.student.firstName} {application.student.lastName}
                          </span>
                        ) : (
                          "Candidat inconnu"
                        )}
                      </TableCell>
                      <TableCell>
                        {application.companyOffer?.title || "Offre inconnue"}
                      </TableCell>
                      <TableCell>
                        {formatDate(application.createdAt.toString())}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeClass(application.status as Apply_Status)}
                        >
                          {getStatusLabel(application.status as Apply_Status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/application/${application.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                          
                          {application.status === 'en_attente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                onClick={() => updateApplicationStatus(application.id, 'accepte')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                onClick={() => updateApplicationStatus(application.id, 'refuse')}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Refuser
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyApplicationsPage; 