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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user?.email || "",
      description: student.description || "",
      isAvailable: student.isAvailable,
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    }
  };

  const handleCVChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    }
  };

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      await StudentService.updateStudent(student.id, {
        ...values,
        skillsId: selectedSkills,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
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
                <Textarea {...field} />
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
                <FormLabel className="text-base">Disponibilité</FormLabel>
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
        <div className="space-y-2">
          <FormLabel>Compétences</FormLabel>
          <SkillsCombobox
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableSkills={allSkills}
          />
        </div>
        <div className="space-y-2">
          <FormLabel>Photo de profil</FormLabel>
          <div className="flex items-center gap-4">
            {student.profilePicture && (
              <Image
                src={`/api/file/${student.profilePicture.id}`}
                alt="Photo de profil"
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-3/5"
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormLabel>CV</FormLabel>
          <div className="flex items-center gap-4">
            {student.CV && (
              <a
                href={`/api/file/${student.CV.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline w-2/5"
              >
                Voir mon CV actuel
              </a>
            )}
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVChange}
              className="w-3/5"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
