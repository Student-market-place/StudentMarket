"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import SchoolService from "@/services/school.service";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { StudentWithRelation } from "@/types/student.type";
import { StudentResponseDto } from "@/types/dto/student.dto";
import { Pencil } from "lucide-react";
import { EnumStatusTYpe } from "@prisma/client";

type StudentStatus = "stage" | "alternance";

interface UpdateStudentData {
  firstName: string;
  lastName: string;
  status: string;
  description: string;
  isAvailable: boolean;
  userId: string;
  skillsId: string[];
  schoolId: string;
  CVId?: string;
  profilePictureId?: string;
}

interface UpdateStudentProps {
  student: StudentWithRelation | StudentResponseDto;
}

export function UpdateStudent({ student }: UpdateStudentProps) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [status, setStatus] = useState<StudentStatus>(
    student.status === "stage" || student.status === "alternance"
      ? student.status
      : "stage"
  );
  const [description, setDescription] = useState(student.description || "");
  const [isAvailable, setIsAvailable] = useState(student.isAvailable);
  const [selectedSchoolId, setSelectedSchoolId] = useState(student.schoolId);

  const queryClient = useQueryClient();

  // Fonction pour vérifier si nous avons un StudentWithRelation
  const isStudentWithRelation = (student: StudentWithRelation | StudentResponseDto): student is StudentWithRelation => {
    return 'profilePicture' in student || 'CV' in student;
  };

  // Fonction pour obtenir les compétences de manière sécurisée
  const getSkillIds = () => {
    if (!student.skills) return [];
    return student.skills.map((skill) => skill.id);
  };

  // Fonction pour obtenir l'ID utilisateur de manière sécurisée
  const getUserId = () => {
    if (!student.user) return "";
    return student.user.id;
  };

  // Récupérer la liste des écoles
  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: SchoolService.fetchSchools,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchoolId) {
      toast.error("Veuillez sélectionner une école");
      return;
    }

    try {
      const updateData: any = {
        id: student.id, // Ajout de l'ID requis pour UpdateStudentDto
        firstName,
        lastName,
        status: status as EnumStatusTYpe,
        description,
        isAvailable,
        schoolId: selectedSchoolId,
        skills: getSkillIds(), // Utiliser les skills disponibles
      };

      // Ajouter CVId et profilePictureId seulement s'ils existent
      if (isStudentWithRelation(student) && student.CV?.id) {
        updateData.CVId = student.CV.id;
      } else if (student.CVId) {
        updateData.CVId = student.CVId;
      }

      if (isStudentWithRelation(student) && student.profilePicture?.id) {
        updateData.profilePictureId = student.profilePicture.id;
      } else if (student.profilePictureId) {
        updateData.profilePictureId = student.profilePictureId;
      }

      // Vérification des champs obligatoires
      const requiredFields = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        status: updateData.status,
        schoolId: updateData.schoolId,
      };

      console.log("Vérification des champs obligatoires:", requiredFields);

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.error("Champs manquants:", missingFields);
        toast.error(
          `Champs obligatoires manquants: ${missingFields.join(", ")}`
        );
        return;
      }

      console.log("Données envoyées à l'API:", updateData);
      await StudentService.updateStudent(student.id, updateData);

      await queryClient.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      toast.success("Étudiant mis à jour avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      console.error("Message d'erreur:", error.response?.data);
      toast.error("Erreur lors de la mise à jour de l'étudiant");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un étudiant</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'étudiant ici. Cliquez sur enregistrer
            une fois terminé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">École</Label>
            <Select
              value={selectedSchoolId}
              onValueChange={setSelectedSchoolId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une école" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stage"
                  checked={status === "stage"}
                  onCheckedChange={() => setStatus("stage")}
                />
                <Label htmlFor="stage" className="font-normal">
                  Stage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alternance"
                  checked={status === "alternance"}
                  onCheckedChange={() => setStatus("alternance")}
                />
                <Label htmlFor="alternance" className="font-normal">
                  Alternance
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre profil, vos compétences et vos objectifs..."
              className="h-32"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
            <Label htmlFor="isAvailable">Disponible</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
