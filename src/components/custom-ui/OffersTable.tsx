import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { StudentWithRelation } from "@/types/student.type";

// Interface simplifiée pour l'école
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

// Props du composant OffersTable
export interface OffersTableProps {
  offers: CompanyOfferWithRelation[];
  students: StudentWithRelation[];
  school: SimplifiedSchool | null;
}

export const OffersTable: React.FC<OffersTableProps> = ({ offers, students, school }) => {
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