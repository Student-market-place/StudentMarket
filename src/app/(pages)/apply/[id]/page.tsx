"use client";

import { useQuery } from "@tanstack/react-query";
import CompanyOfferService from "@/services/companyOffer.service";
import { CompanyOfferWithRelation } from "@/types/companyOffer.type";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Check, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!storedUserId) {
      router.push("/login?redirect=" + encodeURIComponent(`/apply/${id}`));
    }
  }, [id, router]);

  const { data: offer, isLoading } = useQuery<CompanyOfferWithRelation>({
    queryKey: ["company_offer", id],
    queryFn: () => CompanyOfferService.fetchCompanyOffer(id as string),
    enabled: !!id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !offer) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation de l'envoi de la candidature
      // Remplacer par l'appel API réel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push(`/offer/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="w-full h-[200px] animate-pulse bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h1 className="text-xl font-bold text-red-600 mb-2">Offre non trouvée</h1>
          <p className="text-red-600">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
          <Link href="/home">
            <Button className="mt-4">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (offer.status !== "en_cours") {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h1 className="text-xl font-bold text-amber-600 mb-2">Candidature impossible</h1>
          <p className="text-amber-600">Cette offre n'est plus disponible pour candidature.</p>
          <Link href={`/offer/${id}`}>
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'offre
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-green-600 mb-2">Candidature envoyée avec succès !</h1>
          <p className="text-green-600">Votre candidature a bien été transmise à l'entreprise.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <Link href={`/offer/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'offre
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations sur l'offre */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Résumé de l'offre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="text-sm text-gray-500">{offer.company.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Type</h4>
                <p>{offer.type === 'stage' ? 'Stage' : 'Alternance'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Compétences requises</h4>
                <ul className="list-disc pl-5 text-sm">
                  {offer.skills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Formulaire de candidature */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Formulaire de candidature</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="motivationLetter">Lettre de motivation</Label>
                  <Textarea
                    id="motivationLetter"
                    placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé(e) par cette offre..."
                    rows={6}
                    value={motivationLetter}
                    onChange={(e) => setMotivationLetter(e.target.value)}
                    required
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cv">CV (optionnel)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      id="cv"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                    <Label htmlFor="cv" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      {file ? (
                        <span className="text-sm font-medium text-blue-600">{file.name}</span>
                      ) : (
                        <>
                          <span className="font-medium">Cliquez pour télécharger</span>
                          <span className="text-xs text-gray-500">PDF, DOC, DOCX (max. 5MB)</span>
                        </>
                      )}
                    </Label>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !motivationLetter.trim()}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 