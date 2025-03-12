"use client";

import { useState, useEffect } from "react";
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
import UserService from "@/services/user.service";
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
import { EnumStatusTYpe } from "@prisma/client";
import { SchoolResponseDto } from "@/types/dto/school.dto";

type StudentStatus = "stage" | "alternance";

export function CreateStudent() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StudentStatus>("stage");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  const queryClient = useQueryClient();

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
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await UserService.fetchUserByEmail(email);
      if (existingUser) {
        toast.error("Un utilisateur avec cet email existe déjà");
        return;
      }

      // Créer l'utilisateur
      const user = await UserService.createUser({
        email,
        name: `${firstName} ${lastName}`,
      });

      // Mettre à jour le rôle de l'utilisateur
      await UserService.updateUserRole({
        userId: user.id,
        role: "student",
      });

      // Créer l'étudiant
      await StudentService.createStudent({
        firstName,
        lastName,
        status: status as EnumStatusTYpe,
        description,
        isAvailable,
        userId: user.id,
        schoolId: selectedSchoolId,
      });

      await queryClient.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      toast.success("Étudiant créé avec succès");

      // Réinitialiser le formulaire
      setFirstName("");
      setLastName("");
      setEmail("");
      setStatus("stage");
      setDescription("");
      setIsAvailable(true);
      setSelectedSchoolId("");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de l'étudiant");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un étudiant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un étudiant</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel étudiant ici. Cliquez sur enregistrer une fois
            terminé.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
