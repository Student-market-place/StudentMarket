"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StudentTable } from "@/components/custom-ui/table/StudentTable";
import { OffersTable } from "@/components/custom-ui/OffersTable";
import { AnalyticsPanel } from "@/components/custom-ui/AnalyticsPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import SchoolService from "@/services/school.service";
import StudentService from "@/services/student.service";
import CompanyOfferService from "@/services/companyOffer.service";
import { StudentWithRelation } from "@/types/student.type";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { OfferStatus } from "@prisma/client";

// Définir un type pour l'erreur
// type ErrorType = {
//   message: string;
// };

// Composant d'affichage du chargement
const DashboardLoading = () => (
  <div className="space-y-6 p-12">
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-md" />
      ))}
    </div>

    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  </div>
);

// Interface simplifiée pour la version du tableau de bord
interface SimplifiedSchool {
  id: string;
  name: string;
  domainName?: string;
  user?: {
    email?: string;
  };
  profilePicture?: {
    url?: string;
  };
}

// Contenu du tableau de bord
const DashboardContent = () => {
  const params = useParams();
  const schoolId = typeof params.id === "string" ? params.id : "";
  const [school, setSchool] = useState<SimplifiedSchool | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        // Chargement des données de l'école
        const schoolData = await SchoolService.fetchSchool(schoolId);
        // Créer un objet simplifié pour le tableau de bord
        setSchool({
          id: schoolData.id,
          name: schoolData.name,
          domainName: schoolData.domainName,
          // Ces propriétés peuvent ne pas exister dans la réponse initiale
          user: { email: "admin@" + schoolData.domainName },
          profilePicture: { url: "" },
        });

        // Chargement des étudiants associés à cette école
        // Note: Nous supposons ici que fetchStudents peut filtrer par école d'une autre façon
        const studentsData = await StudentService.fetchStudents({});
        // Filtrer côté client les étudiants associés à cette école
        const schoolStudents = studentsData.filter(
          (student) => student.school && student.school.id === schoolId
        );
        setStudents(schoolStudents);

        // Chargement des offres disponibles
        // Extraction des compétences des étudiants pour le filtrage
        const studentSkills = new Set<string>();
        schoolStudents.forEach((student) => {
          if (student.skills) {
            student.skills.forEach((skill) => {
              studentSkills.add(skill.name);
            });
          }
        });

        // Récupération des offres ouvertes qui correspondent aux compétences des étudiants
        const offersData = await CompanyOfferService.fetchCompanyOffers({
          status: "en_cours" as OfferStatus, // Utiliser la valeur enum correcte
        });

        // Filtrer les offres pertinentes pour les étudiants de cette école
        // Une offre est pertinente si au moins une de ses compétences requises correspond à celles des étudiants
        const relevantOffers = offersData.filter((offer) => {
          if (!offer.skills || offer.skills.length === 0) return false;

          // Vérifier s'il y a au moins une correspondance entre les compétences de l'offre et celles des étudiants
          return offer.skills.some((offerSkill) => {
            const skillName =
              typeof offerSkill === "string" ? offerSkill : offerSkill.name;
            return studentSkills.has(skillName);
          });
        });

        setOffers(relevantOffers);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchSchoolData();
    }
  }, [schoolId]);

  if (loading) return <DashboardLoading />;
  if (!school) return <div>École non trouvée</div>;

  // Calcul des statistiques
  const studentCount = students.length;
  const availableStudents = students.filter(
    (student) => student.isAvailable
  ).length;
  const availabilityRate =
    studentCount > 0 ? (availableStudents / studentCount) * 100 : 0;

  // Grouper les étudiants par compétence pour la visualisation
  const skillGroups: Record<string, number> = {};
  students.forEach((student) => {
    if (student.skills) {
      student.skills.forEach((skill: { name: string }) => {
        if (!skillGroups[skill.name]) skillGroups[skill.name] = 0;
        skillGroups[skill.name]++;
      });
    }
  });

  // Trier les compétences par popularité
  const sortedSkills = Object.entries(skillGroups)
    .sort(([, countA], [, countB]) => Number(countB) - Number(countA))
    .slice(0, 5);

  return (
    <div className="space-y-8 p-12">
      {/* En-tête avec informations de l'école */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={school.profilePicture?.url || ""}
              alt={school.name}
            />
            <AvatarFallback>
              {school.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{school.name}</h1>
            <p className="text-gray-500">{school.user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Étudiants inscrits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studentCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Étudiants associés à votre école
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Taux de disponibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {availabilityRate.toFixed(0)}%
            </div>
            <Progress value={availabilityRate} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {availableStudents} étudiants disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Compétences principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sortedSkills.map(([skill, count]) => (
                <Badge key={skill} variant="secondary">
                  {skill} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour différentes sections */}
      <Tabs defaultValue="students">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="students">Étudiants</TabsTrigger>
          <TabsTrigger value="offers">Offres</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>Liste des étudiants</CardTitle>
              <CardDescription>
                Gérez les étudiants associés à votre école
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentTable students={students} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="p-0">
          <OffersTable offers={offers} students={students} school={school} />
        </TabsContent>

        <TabsContent value="analytics" className="p-0">
          <AnalyticsPanel students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DashboardSchoolPage = () => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardSchoolPage;
