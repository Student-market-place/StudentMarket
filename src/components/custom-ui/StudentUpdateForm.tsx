"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { StudentWithRelation } from "@/types/student.type";
import { Skill } from "@prisma/client";
import { SkillsCombobox } from "./SkillsCombobox";
import { useRouter } from "next/navigation";
import StudentService from "@/services/student.service";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface StudentUpdateFormProps {
  student: StudentWithRelation;
  allSkills: Skill[];
}

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "L'email doit être valide.",
  }),
  description: z.string().optional(),
  isAvailable: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function StudentUpdateForm({
  student,
  allSkills,
}: StudentUpdateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    student.skills.map((skill) => skill.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isCVUploading, setIsCVUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user?.email || "",
      description: student.description || "",
      isAvailable: student.isAvailable,
    },
    mode: "onChange",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload du fichier");
      }

      const data = await response.json();

      await StudentService.updateStudent(student.id, {
        profilePictureId: data.fileId,
      });

      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil");
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleCVChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCVUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload du fichier");
      }

      const data = await response.json();

      await StudentService.updateStudent(student.id, {
        CVId: data.fileId,
      });

      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      toast.success("CV mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de la mise à jour du CV");
    } finally {
      setIsCVUploading(false);
    }
  };

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      await StudentService.updateStudent(student.id, {
        ...values,
        skillIds: selectedSkills,
      });
      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      toast.success("Profil mis à jour avec succès");
      router.push(`/student/${student.id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-5xl shadow-md">
      <CardHeader>
        <CardTitle>Modifier le profil</CardTitle>
        <CardDescription>
          Mettez à jour les informations de votre profil étudiant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche - Informations personnelles */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  Informations personnelles
                </h3>

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-32"
                          placeholder="Décrivez votre profil, vos expériences et vos intérêts..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Disponibilité
                        </FormLabel>
                        <FormDescription>
                          Indiquez si vous êtes disponible pour des opportunités
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Colonne droite - Compétences et documents */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  Compétences et documents
                </h3>

                <div className="space-y-4">
                  <FormLabel>Compétences</FormLabel>
                  <SkillsCombobox
                    selectedSkills={selectedSkills}
                    onSkillsChange={setSelectedSkills}
                    availableSkills={allSkills}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>Photo de profil</FormLabel>
                  <div className="flex flex-col items-start gap-4">
                    {student.profilePicture && (
                      <div className="border rounded-lg p-2 w-full flex justify-center">
                        <Image
                          src={`/api/file/${student.profilePicture.id}`}
                          alt="Photo de profil"
                          width={120}
                          height={120}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div className="w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                        disabled={isFileUploading}
                      />
                      {isFileUploading && (
                        <p className="text-sm text-gray-500 mt-1">
                          Téléchargement en cours...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormLabel>CV</FormLabel>
                  <div className="flex flex-col items-start gap-4">
                    {student.CV && (
                      <div className="border rounded-lg p-3 w-full">
                        <a
                          href={`/api/file/${student.CV.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Voir mon CV actuel
                        </a>
                      </div>
                    )}
                    <div className="w-full">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCVChange}
                        className="w-full"
                        disabled={isCVUploading}
                      />
                      {isCVUploading && (
                        <p className="text-sm text-gray-500 mt-1">
                          Téléchargement en cours...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de soumission en bas au centre */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-full md:w-1/3"
                disabled={
                  isSubmitting ||
                  isFileUploading ||
                  isCVUploading ||
                  !form.formState.isDirty
                }
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
