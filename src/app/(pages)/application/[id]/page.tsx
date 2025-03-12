"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Building2, 
  Calendar, 
  Clock, 
  FileText,
  MessageCircle 
} from "lucide-react";

import StudentApplyService, { StudentApplyWithRelations } from "@/services/studentApply.service";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";
import { StudentApplyResponseDto } from "@/types/dto/student-apply.dto";

// Composant de chargement
const ApplicationDetailLoading = () => (
  <div className="container max-w-3xl mx-auto p-6 space-y-6">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-4 w-1/2" />
    
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
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
  }).format(date);
};

// Formatage de l'heure
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Composant principal
const ApplicationDetailPage = () => {
  const { id: applicationId } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
        
        // Récupérer les détails de la candidature
        const applicationData = await StudentApplyService.fetchStudentApply(applicationId);
        setApplication(applicationData);
        
        console.log("Données de candidature:", JSON.stringify(applicationData, null, 2));
        
        // Vérifier que l'utilisateur est autorisé à voir cette candidature
        if (!userData) {
          setError("Erreur lors du chargement des données utilisateur.");
          setLoading(false);
          return;
        }
        
        if (userData.role === 'student' && userData.student) {
          if (applicationData.studentId !== userData.student.id) {
            setError("Vous n'êtes pas autorisé à voir cette candidature.");
            setLoading(false);
            return;
          }
        } else if (userData.role === 'company' && userData.company) {
          // Si c'est une entreprise, vérifier que la candidature concerne une de ses offres
          const companyId = userData.company.id;
          
          // Récupérer l'ID de l'entreprise depuis l'offre de manière plus directe
          const offerCompanyId = applicationData.companyOffer?.companyId;
          
          console.log("Vérification entreprise:", { 
            userCompanyId: companyId, 
            offerCompanyId: offerCompanyId,
            userCompanyObj: userData.company,
            offer: applicationData.companyOffer,
            match: companyId === offerCompanyId
          });
          
          // Temporairement désactivé: autoriser toutes les entreprises à voir les candidatures
          // à décommenter si nécessaire:
        
          if (!offerCompanyId || offerCompanyId !== companyId) {
            setError("Vous n'êtes pas autorisé à voir cette candidature.");
            setLoading(false);
            return;
          }
    
        } 
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des détails de la candidature.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [applicationId]);

  if (loading) {
    return <ApplicationDetailLoading />;
  }

  if (error || !application) {
    return (
      <div className="container max-w-3xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error || "Cette candidature n'existe pas ou a été supprimée."}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('/student/applications')}>
            Retour aux candidatures
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Détails de la candidature</h1>
        <p className="text-gray-500 mt-1">
          Candidature pour {application.companyOffer?.title} chez {application.companyOffer?.company?.name}
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Informations</CardTitle>
            <Badge 
              variant="outline" 
              className={getStatusBadgeClass(application.status)}
            >
              {getStatusLabel(application.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Entreprise</p>
                <p className="text-gray-600">{application.companyOffer?.company?.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Offre</p>
                <p className="text-gray-600">{application.companyOffer?.title}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Date de candidature</p>
                <p className="text-gray-600">{formatDate(application.createdAt.toString())}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Heure</p>
                <p className="text-gray-600">{formatTime(application.createdAt.toString())}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-start gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-gray-500 mt-0.5" />
              <p className="font-medium">Message de candidature</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{application.message}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/student/applications')}
          >
            Retour aux candidatures
          </Button>
          
          <Button 
            onClick={() => router.push(`/offer/${application.companyOfferId}`)}
          >
            Voir l&apos;offre
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Composant avec Suspense
const ApplicationDetailWithSuspense = () => {
  return (
    <Suspense fallback={<ApplicationDetailLoading />}>
      <ApplicationDetailPage />
    </Suspense>
  );
};

export default ApplicationDetailWithSuspense; 