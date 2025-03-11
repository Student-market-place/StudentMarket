import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentWithRelation } from "@/types/student.type";

// Props du composant AnalyticsPanel
export interface AnalyticsPanelProps {
  students: StudentWithRelation[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ students }) => {
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