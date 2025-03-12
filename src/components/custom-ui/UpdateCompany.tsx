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
import { Pencil } from "lucide-react";
import { CompanyWithRelation } from "@/types/company.type";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import CompanyService from "@/services/company.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";

interface UpdateCompanyProps {
  id: string;
  company: CompanyWithRelation;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(1, {
    message: "La description est requise.",
  }),
  email: z
    .string()
    .email({
      message: "L'email doit être valide.",
    })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export function UpdateCompany({ company }: UpdateCompanyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name,
      email: company.user.email || "",
      description: company.description,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        name: values.name,
        description: values.description,
        ...(values.email && { email: values.email }),
      };
      await CompanyService.putCompany(company.id, dataToSubmit);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Entreprise mise à jour avec succès");
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'entreprise");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Mise à jour de l&apos;entreprise {company.name}
          </DialogTitle>
          <DialogDescription>
            Remplissez tous les champs pour mettre à jour l&apos;entreprise
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
                  <FormLabel>Nom</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCompany;
