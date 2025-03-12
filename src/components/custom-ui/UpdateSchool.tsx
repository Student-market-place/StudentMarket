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
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import SchoolService from "@/services/school.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "../ui/switch";
import { SchoolResponseDto } from "@/types/dto/school.dto";

interface UpdateSchoolProps {
  school: SchoolResponseDto;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  domainName: z.string().min(2, {
    message: "Le domaine doit contenir au moins 2 caractères.",
  }),
  email: z
    .string()
    .email({
      message: "L'email doit être valide.",
    })
    .optional(),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function UpdateSchool({ school }: UpdateSchoolProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school.name,
      email: school.user?.email || "",
      domainName: school.domainName,
      isActive: school.isActive,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        id: school.id,
        name: values.name,
        domainName: values.domainName,
        ...(values.email && { email: values.email }),
        ...(typeof values.isActive !== "undefined" && {
          isActive: values.isActive,
        }),
      };
      await SchoolService.updateSchool(school.id, dataToSubmit);
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("École mise à jour avec succès");
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'école");
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
          <DialogTitle>Mise à jour de l&apos;école {school.name}</DialogTitle>
          <DialogDescription>
            Remplissez tous les champs pour mettre à jour l&apos;école
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
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domaine</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
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

export default UpdateSchool;
