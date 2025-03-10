"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanyWithRelation } from "@/types/company.type";
import { useRouter } from "next/navigation";
import CompanyService from "@/services/company.service";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface CompanyUpdateFormProps {
  company: CompanyWithRelation;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "L&apos;email doit être valide.",
  }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CompanyUpdateForm({ company }: CompanyUpdateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name,
      email: company.user.email || "",
      description: company.description || "",
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
        throw new Error("Erreur lors de l&apos;upload du fichier");
      }

      const data = await response.json();

      await CompanyService.putCompany(company.id, {
        profilePictureId: data.fileId,
      });

      queryClient.invalidateQueries({ queryKey: ["company", company.id] });
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l&apos;upload:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil");
    }
  };

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      await CompanyService.putCompany(company.id, values);
      queryClient.invalidateQueries({ queryKey: ["company", company.id] });
      toast.success("Profil mis à jour avec succès");
      router.push(`/company/${company.id}`);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;entreprise</FormLabel>
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
        <div className="space-y-2">
          <FormLabel>Logo</FormLabel>
          <div className="flex items-center gap-4">
            {company.profilePicture && (
              <Image
                src={`/api/file/${company.profilePicture.id}`}
                alt="Logo de l'entreprise"
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
