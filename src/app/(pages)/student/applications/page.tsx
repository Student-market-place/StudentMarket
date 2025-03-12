"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, Eye } from "lucide-react";

import StudentApplyService, { StudentApplyWithRelations } from "@/services/studentApply.service";
import { StudentApplyResponseDto } from "@/types/dto/student-apply.dto";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";

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
const getStatusBadgeClass = (status: string) => {
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
const getStatusLabel = (status: string) => {
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Composant principal
const ApplicationsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [applications, setApplications] = useState<StudentApplyResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer l'utilisateur connecté
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError("Vous devez être connecté pour accéder à cette page.");
          setLoading(false);
          return;
        }
        
        const userData = await UserService.fetchUserById(userId);
        setUser(userData);
        
        // Vérifier si l'utilisateur est un étudiant
        if (!userData || userData.role !== 'student' || !userData.student) {
          setError("Vous devez être un étudiant pour accéder à cette page.");
          setLoading(false);
          return;
        }
        
        // Récupérer les candidatures de l'étudiant
        const applications = await StudentApplyService.fetchStudentApplies(userData.student!.id);
        setApplications(applications);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement de vos candidatures.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
          <Button onClick={() => router.push('/home')}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes candidatures</h1>
        <p className="text-gray-500 mt-1">
          Suivez l&apos;état de vos candidatures aux offres d&apos;emploi
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique de vos candidatures</CardTitle>
          <CardDescription>
            {applications.length === 0 
              ? "Vous n'avez pas encore postulé à des offres" 
              : `Vous avez postulé à ${applications.length} offre${applications.length > 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de candidature</p>
              <Button onClick={() => router.push('/home')}>
                Découvrir les offres
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Offre</TableHead>
                    <TableHead className="w-[20%]">Entreprise</TableHead>
                    <TableHead className="w-[20%]">Date de candidature</TableHead>
                    <TableHead className="w-[15%]">Statut</TableHead>
                    <TableHead className="w-[15%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(application => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.companyOffer?.title || "Offre non disponible"}
                      </TableCell>
                      <TableCell>
                        {application.companyOffer?.company?.name || "Inconnue"}
                      </TableCell>
                      <TableCell>
                        {formatDate(application.createdAt.toString())}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeClass(application.status)}
                        >
                          {getStatusLabel(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/offer/${application.companyOfferId}`)}
                            title="Voir l'offre"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/application/${application.id}`)}
                            title="Détails de la candidature"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
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

// Composant avec Suspense
const ApplicationsWithSuspense = () => {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationsPage />
    </Suspense>
  );
};

export default ApplicationsWithSuspense; 