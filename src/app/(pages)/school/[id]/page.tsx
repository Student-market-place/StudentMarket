"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StudentTable } from "@/components/custom-ui/table/StudentTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { SchoolWithRelations } from "@/types/school.type";
import SchoolService from "@/services/school.service";
import StudentService from "@/services/student.service";
import CompanyOfferService from "@/services/companyOffer.service";
import { StudentWithRelation } from "@/types/student.type";
import { Pencil } from "lucide-react";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import React from "react";

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

// Composant pour le tableau des offres
interface OffersTableProps {
  offers: CompanyOfferWithRelation[];
  students: StudentWithRelation[];
  school: SimplifiedSchool | null;
}

const OffersTable: React.FC<OffersTableProps> = ({ offers, students, school }) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offres d'emploi</CardTitle>
        <CardDescription>
          Découvrez les offres disponibles pour vos étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Offres correspondant aux compétences de vos étudiants</h3>
              <p className="text-sm text-muted-foreground">
                {offers.length} offres correspondent aux compétences principales de vos étudiants
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filtrer
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Titre</TableHead>
                  <TableHead className="w-[20%]">Entreprise</TableHead>
                  <TableHead className="w-[15%]">Type</TableHead>
                  <TableHead className="w-[15%]">Compétences</TableHead>
                  <TableHead className="w-[15%] text-center">Étudiants compatibles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucune offre trouvée correspondant aux compétences de vos étudiants
                    </TableCell>
                  </TableRow>
                ) : (
                  offers.map((offer) => {
                    // Calcul du nombre d'étudiants compatibles avec cette offre
                    const offerSkills = offer.skills?.map(skill => 
                      typeof skill === 'string' ? skill : skill.name
                    ) || [];
                    
                    const compatibleStudents = students.filter(student => 
                      student.skills && 
                      student.skills.some(skill => 
                        offerSkills.includes(skill.name)
                      )
                    );
                    
                    return (
                      <React.Fragment key={offer.id}>
                        <TableRow 
                          className="cursor-pointer hover:bg-gray-50 transition-colors" 
                          onClick={() => setSelectedOfferId(selectedOfferId === offer.id ? null : offer.id)}
                        >
                          <TableCell className="font-medium">
                            {offer.title}
                          </TableCell>
                          <TableCell>
                            {offer.company ? offer.company.name : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{offer.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {offerSkills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {offerSkills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{offerSkills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="default" 
                              className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              {compatibleStudents.length}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        
                        {/* Bandeau des étudiants compatibles */}
                        {selectedOfferId === offer.id && compatibleStudents.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-gray-50 px-4 py-3 border-t">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-semibold text-gray-700">
                                    Étudiants compatibles avec cette offre
                                  </h4>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setSelectedOfferId(null)}
                                    className="h-7 px-2"
                                  >
                                    Fermer
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {compatibleStudents.map(student => (
                                    <div 
                                      key={student.id} 
                                      className="flex items-center justify-between bg-white p-3 rounded-md border"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={student.profilePicture?.url || ''} alt={student.firstName} />
                                          <AvatarFallback>
                                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-sm">
                                            {student.firstName} {student.lastName}
                                          </p>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {student.skills?.slice(0, 2).map(skill => (
                                              <Badge key={skill.id} variant="outline" className="text-xs">
                                                {skill.name}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <a 
                                        href={`mailto:${student.user?.email || ''}?subject=Opportunité professionnelle - ${offer.title}&body=Bonjour ${student.firstName},%0D%0A%0D%0ANous avons remarqué que votre profil correspond à une offre de ${offer.title} chez ${offer.company?.name || 'notre partenaire'}.%0D%0A%0D%0ACordialement,%0D%0A${school?.name || 'L\'équipe pédagogique'}`}
                                        onClick={(e) => e.stopPropagation()} // Empêcher le clic de se propager à la ligne
                                      >
                                        <Button size="sm" variant="default" className="h-8">
                                          Contacter
                                        </Button>
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour le panneau d'analyses
interface AnalyticsPanelProps {
  students: StudentWithRelation[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ students }) => {
  // Statistiques pour les analyses
  const placementRates = [
    { year: 2020, rate: 20 },
    { year: 2021, rate: 35 },
    { year: 2022, rate: 50 },
    { year: 2023, rate: 65 },
    { year: 2024, rate: 75 }
  ];
  
  // Compétences les plus demandées (simulations)
  const topSkills = [
    { name: 'React', offerCount: 78, percentage: 85 },
    { name: 'Python', offerCount: 65, percentage: 70 },
    { name: 'TypeScript', offerCount: 52, percentage: 65 },
    { name: 'Java', offerCount: 45, percentage: 55 },
    { name: 'Node.js', offerCount: 38, percentage: 45 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytiques</CardTitle>
        <CardDescription>
          Visualisez les statistiques et tendances de placement de vos étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Graphique de placement des étudiants */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Taux de placement des étudiants</h3>
            <div className="border rounded-lg p-4 h-64 bg-gray-50">
              <div className="h-full flex items-end">
                <div className="flex items-end justify-around w-full h-full text-center">
                  {placementRates.map(({ year, rate }) => (
                    <div key={year} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-blue-500 rounded-t-md"
                        style={{ height: `${rate}%` }}
                      ></div>
                      <span className="text-xs mt-2">{year}</span>
                      <span className="text-xs font-medium">{rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Évolution du taux de placement des étudiants au cours des 5 dernières années</p>
          </div>
          
          {/* Statistiques clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Durée moyenne de recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,5 mois</div>
                <p className="text-xs text-gray-500">-15% par rapport à l'année précédente</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Taux de conversion stage → emploi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-gray-500">+8% par rapport à l'année précédente</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Salaire moyen des nouveaux diplômés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38 500 €</div>
                <p className="text-xs text-gray-500">+5% par rapport à l'année précédente</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Compétences les plus demandées */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Compétences les plus demandées</h3>
            <div className="space-y-2">
              {topSkills.map(skill => (
                <div key={skill.name} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.offerCount} offres</span>
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{skill.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Button variant="outline">Télécharger le rapport complet</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Contenu du tableau de bord
const DashboardContent = () => {
  const params = useParams();
  const schoolId = typeof params.id === 'string' ? params.id : '';
  const [school, setSchool] = useState<SimplifiedSchool | null>(null);
  const [students, setStudents] = useState<StudentWithRelation[]>([]);
  const [offers, setOffers] = useState<CompanyOfferWithRelation[]>([]);
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
          user: { email: 'admin@' + schoolData.domainName },
          profilePicture: { url: '' }
        });
        
        // Chargement des étudiants associés à cette école
        // Note: Nous supposons ici que fetchStudents peut filtrer par école d'une autre façon
        const studentsData = await StudentService.fetchStudents({});
        // Filtrer côté client les étudiants associés à cette école
        const schoolStudents = studentsData.filter(student => 
          student.school && student.school.id === schoolId
        );
        setStudents(schoolStudents);

        // Chargement des offres disponibles
        // Extraction des compétences des étudiants pour le filtrage
        const studentSkills = new Set<string>();
        schoolStudents.forEach(student => {
          if (student.skills) {
            student.skills.forEach(skill => {
              studentSkills.add(skill.name);
            });
          }
        });
        
        // Récupération des offres ouvertes qui correspondent aux compétences des étudiants
        const offersData = await CompanyOfferService.fetchCompanyOffers({
          status: "Open" as any // Utiliser directement la valeur au lieu de l'énumération
        });
        
        // Filtrer les offres pertinentes pour les étudiants de cette école
        // Une offre est pertinente si au moins une de ses compétences requises correspond à celles des étudiants
        const relevantOffers = offersData.filter(offer => {
          if (!offer.skills || offer.skills.length === 0) return false;
          
          // Vérifier s'il y a au moins une correspondance entre les compétences de l'offre et celles des étudiants
          return offer.skills.some(offerSkill => {
            const skillName = typeof offerSkill === 'string' 
              ? offerSkill 
              : offerSkill.name;
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
  const availableStudents = students.filter(student => student.isAvailable).length;
  const availabilityRate = studentCount > 0 ? (availableStudents / studentCount) * 100 : 0;
  
  // Grouper les étudiants par compétence pour la visualisation
  const skillGroups: Record<string, number> = {};
  students.forEach(student => {
    if (student.skills) {
      student.skills.forEach(skill => {
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
            <AvatarImage src={school.profilePicture?.url || ''} alt={school.name} />
            <AvatarFallback>{school.name.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{school.name}</h1>
            <p className="text-gray-500">{school.user?.email || ''}</p>
          </div>
        </div>
      </div>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Étudiants inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studentCount}</div>
            <p className="text-xs text-gray-500 mt-1">Étudiants associés à votre école</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Taux de disponibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availabilityRate.toFixed(0)}%</div>
            <Progress value={availabilityRate} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 mt-1">{availableStudents} étudiants disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Compétences principales</CardTitle>
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
