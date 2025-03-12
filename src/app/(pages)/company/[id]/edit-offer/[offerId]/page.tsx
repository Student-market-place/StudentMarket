"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CompanyOfferService from "@/services/companyOffer.service";
import SkillService from "@/services/skill.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skill, EnumStatusTYpe } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { CompanyOffer, Type, Status } from "@/types/companyOffer.type";
import { UpdateCompanyOfferDto } from "@/types/dto/company-offer.dto";

interface Option {
  label: string;
  value: string;
}

interface EditOfferFormData {
  title: string;
  description: string;
  type: "Stage" | "Alternance";
  startDate: string;
  expectedSkills: string;
  skills: string[];
}

const EditOfferPage = () => {
  const { id: companyId, offerId } = useParams() as { id: string; offerId: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EditOfferFormData>();

  // Récupérer toutes les compétences disponibles
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: () => SkillService.fetchSkills(),
  });

  // Récupérer les détails de l'offre
  const { data: offer, isLoading: isLoadingOffer } = useQuery({
    queryKey: ["company_offer", offerId],
    queryFn: () => CompanyOfferService.fetchCompanyOffer(offerId),
  });

  // Effet pour pré-remplir le formulaire lorsque les données sont chargées
  useEffect(() => {
    if (offer && skills.length > 0) {
      // Pré-remplir le formulaire avec les données existantes
      reset({
        title: offer.title,
        description: offer.description,
        type: offer.type === "stage" ? "Stage" : "Alternance",
        startDate: format(new Date(offer.startDate), "yyyy-MM-dd"),
        skills: offer.skills ? offer.skills.map((skill: any) => skill.id || skill) : [],
      });

      // Pré-sélectionner les compétences
      if (offer.skills) {
        const skillOptions = offer.skills
          .map((skill: any) => {
            // Si skills est un tableau d'objets
            const skillId = skill.id || skill;
            const skillObj = typeof skill === 'object' ? skill : skills.find((s: Skill) => s.id === skillId);
            
            return skillObj ? { 
              label: typeof skillObj === 'object' ? skillObj.name : skillObj, 
              value: typeof skillObj === 'object' ? skillObj.id : skillId 
            } : null;
          })
          .filter((s: any): s is Option => s !== null);

        setSelectedSkills(skillOptions);
      }
      
      setIsLoading(false);
    }
  }, [offer, skills, reset]);

  // S'assurer que le code s'exécute seulement côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Vérifier que l'utilisateur est bien le propriétaire de l'entreprise
  useEffect(() => {
    if (!isClient) return; // Ne pas exécuter côté serveur

    const checkUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        console.log("🔍 UserId récupéré:", storedUserId);
        setUserId(storedUserId);

        // Vérifier l'accès à la page
        if (storedUserId) {
          // Code de vérification du propriétaire si nécessaire
        } else {
          console.log("⚠️ Aucun utilisateur connecté");
          toast.error("Vous devez être connecté pour modifier une offre.");
          router.push(`/company/${companyId}`);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la vérification de l'accès:", error);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        router.push(`/company/${companyId}`);
      }
    };

    checkUser();
  }, [companyId, router, isClient]);

  const handleSkillSelect = (skillId: string) => {
    const skill = skills.find((s: Skill) => s.id === skillId);
    if (!skill) return;

    const isAlreadySelected = selectedSkills.some((s) => s.value === skillId);

    if (isAlreadySelected) {
      // Supprimer la compétence
      const filteredSkills = selectedSkills.filter((s) => s.value !== skillId);
      setSelectedSkills(filteredSkills);
      setValue(
        "skills",
        filteredSkills.map((s) => s.value)
      );
    } else {
      // Ajouter la compétence
      const newSkills = [
        ...selectedSkills,
        { label: skill.name, value: skill.id },
      ];
      setSelectedSkills(newSkills);
      setValue(
        "skills",
        newSkills.map((s) => s.value)
      );
    }
  };

  // Fonction pour créer une nouvelle compétence
  const createNewSkill = async () => {
    if (!newSkillName.trim() || isCreatingSkill) {
      return;
    }

    // Vérifier si la compétence existe déjà
    const skillExists = skills.some(
      (s: Skill) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );

    if (skillExists) {
      // Trouver la compétence existante
      const existingSkill = skills.find(
        (s: Skill) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
      );
      
      if (existingSkill) {
        // Vérifier si la compétence n'est pas déjà sélectionnée
        const isAlreadySelected = selectedSkills.some((s) => s.value === existingSkill.id);
        
        if (!isAlreadySelected) {
          // Ajouter la compétence aux sélections
          const skillOption = { label: existingSkill.name, value: existingSkill.id };
          setSelectedSkills([...selectedSkills, skillOption]);
          setValue(
            "skills",
            [...selectedSkills, skillOption].map((s) => s.value)
          );
          toast.success(`La compétence "${existingSkill.name}" a été sélectionnée`);
        } else {
          toast.info(`La compétence "${existingSkill.name}" est déjà sélectionnée`);
        }
        
        // Réinitialiser le champ de saisie
        setNewSkillName("");
      }
      return;
    }

    setIsCreatingSkill(true);

    try {
      // Créer la nouvelle compétence dans la base de données
      const newSkill = await SkillService.createSkill({
        name: newSkillName.trim(),
      });

      // Mettre à jour l'état local
      const skillOption = { label: newSkill.name, value: newSkill.id };
      setSelectedSkills([...selectedSkills, skillOption]);
      setValue(
        "skills",
        [...selectedSkills, skillOption].map((s) => s.value)
      );

      // Rafraîchir la liste complète des compétences
      queryClient.invalidateQueries({ queryKey: ["skills"] });

      // Réinitialiser le champ de saisie
      setNewSkillName("");

      toast.success(`La compétence "${newSkill.name}" a été ajoutée`);
    } catch (error) {
      console.error("Erreur lors de la création de la compétence:", error);
      toast.error("Erreur lors de la création de la compétence");
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const onSubmit = async (data: EditOfferFormData) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour modifier une offre.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Préparer les données pour l'API
      const offerData: UpdateCompanyOfferDto = {
        id: offerId,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        expectedSkills: data.expectedSkills,
        type: data.type === "Stage" ? EnumStatusTYpe.stage : EnumStatusTYpe.alternance,
        skills: data.skills,
      };

      await CompanyOfferService.putCompanyOffer(offerData);

      toast.success("Votre offre a été modifiée avec succès.");

      // Invalider les requêtes pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ["company_offer"] });

      // Rediriger vers la page des offres
      router.push(`/company/${companyId}/offers`);
    } catch (error) {
      console.error("Erreur lors de la modification de l'offre:", error);
      toast.error("Une erreur est survenue lors de la modification de l'offre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!userId) {
    return (
      <div className="container flex items-center justify-center py-8">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être connecté pour modifier une offre.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Afficher un état de chargement
  if (isLoading || isLoadingOffer) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
            <CardDescription>
              Veuillez patienter pendant le chargement des données.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'offre</CardTitle>
          <CardDescription>
            Modifiez les informations de votre offre d&aposemploi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&aposoffre *</Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Le titre est obligatoire",
                })}
                placeholder="Ex: Développeur Web Frontend"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "La description est obligatoire",
                })}
                placeholder="Décrivez les missions, les compétences requises, etc."
                rows={6}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type d&aposoffre *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("type", value as "Stage" | "Alternance")
                  }
                  defaultValue={offer && offer.type ? (offer.type === "stage" ? "Stage" : "Alternance") : "Stage"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", {
                    required: "La date de début est obligatoire",
                  })}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Compétences requises</Label>

              {/* Ajouter une nouvelle compétence */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Ajouter une nouvelle compétence..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={createNewSkill}
                  disabled={isCreatingSkill || !newSkillName.trim()}
                  variant="outline"
                >
                  {isCreatingSkill ? "Ajout..." : "Ajouter"}
                </Button>
              </div>

              <div className="relative">
                <p className="text-sm text-gray-600 mb-1">Sélectionnez les compétences requises:</p>
                {/* Liste des compétences existantes */}
                <div 
                  className="max-h-[300px] overflow-y-auto border rounded p-2"
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#3b82f6 #f3f4f6'
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {skills.map((skill: Skill) => (
                      <div
                        key={skill.id}
                        className={`cursor-pointer p-2 rounded border ${
                          selectedSkills.some((s) => s.value === skill.id)
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => handleSkillSelect(skill.id)}
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
                {skills.length > 12 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>

              {/* Compétences sélectionnées */}
              {selectedSkills.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">
                    Compétences sélectionnées:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill.value}
                        className="bg-blue-100 text-blue-800 text-xs rounded px-2 py-1 flex items-center"
                      >
                        {skill.label}
                        <button
                          type="button"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          onClick={() => handleSkillSelect(skill.value)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/company/${companyId}/offers`)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Modification en cours..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOfferPage; 