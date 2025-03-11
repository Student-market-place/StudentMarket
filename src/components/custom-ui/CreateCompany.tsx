import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import CompanyService from "@/services/company.service";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "L'email doit être valide.",
  }),
  description: z.string().min(1, {
    message: "La description est requise.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function CreateCompany() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);

      // 1. Créer l'utilisateur
      const userResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          role: "company",
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        if (errorData.exists) {
          toast.error("Un utilisateur avec cet email existe déjà");
          return;
        }
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      const userData = await userResponse.json();

      // 2. Créer l'entreprise avec l'ID de l'utilisateur
      const companyData = {
        name: values.name,
        description: values.description,
        userId: userData.id,
        profilePicture: "default-company-profile.jpg",
      };

      await CompanyService.createCompany(companyData);
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Entreprise créée avec succès");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de l'entreprise");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter une entreprise</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une entreprise</DialogTitle>
          <DialogDescription>
            Remplissez tous les champs pour ajouter une nouvelle entreprise
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-96"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de l'entreprise</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@entreprise.com"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
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
                      placeholder="Description de l'entreprise"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
