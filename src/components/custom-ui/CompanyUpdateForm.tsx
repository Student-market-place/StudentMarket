"use client";

import CompanyService from "@/services/company.service";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";
import { CompanyWithRelation } from "@/types/company.type";
import { useQueryClient } from "@tanstack/react-query";

interface FormValues {
  name: string;
  description: string;
  profilePicture: string;
  email: string;
}
interface CompanyUpdateFormProps {
  company: CompanyWithRelation;
}

const CompanyUpdateForm = ({ company }: CompanyUpdateFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      name: company.name,
      description: company.description || "",
      email: company.user.email || "",
      profilePicture: company.profilePicture?.url || "",
    },
  });

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || "Format d'email invalide";
  };

  const checkEmailInput = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const updateData = {
        name: data.name,
        description: data.description,
        email: data.email,
      };

      await CompanyService.putCompany(company.id, updateData);
      queryClient.invalidateQueries({ queryKey: ["company", company.id] });
      toast.success("Votre profil a été mis à jour avec succès");
    } catch (error: any) {
      console.error("Failed to update company:", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour de votre profil"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Mettre à jour le profil de l'entreprise
        </CardTitle>
        <CardDescription>
          Mettez à jour les informations de votre entreprise pour attirer les
          meilleurs talents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          {field.value && (
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={field.value || "/default-company-logo.svg"}
                                alt="Company logo"
                                className="object-cover opacity-50"
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.src = "/default-company-logo.svg";
                                }}
                              />
                              <AvatarFallback className="text-2xl bg-gray-100 opacity-50">
                                {company.name[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <Input
                            type="file"
                            className="cursor-not-allowed opacity-50"
                            disabled
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className={emailError ? "border-red-500" : ""}
                          onChange={(e) => {
                            field.onChange(e);
                            checkEmailInput(e.target.value);
                          }}
                        />
                      </FormControl>
                      {emailError && (
                        <div className="text-xs text-red-500 h-5">
                          {emailError}
                        </div>
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
                        <Textarea {...field} className="h-[41px] resize-none" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !!emailError}
                className={`cursor-pointer ${emailError ? "opacity-50" : ""}`}
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanyUpdateForm;
