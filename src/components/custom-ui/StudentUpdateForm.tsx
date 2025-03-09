import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import React from "react";
import { StudentWithRelation } from "@/types/student.type";
import { SkillsCombobox } from "./SkillsCombobox";
import { Skill } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import UploadService from "@/services/upload.service";
import { toast } from "sonner";
import Image from "next/image";

interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  isAvailable: boolean;
  profilePicture: string;
  cv: string;
  description: string;
  skills: string[];
}

interface StudentUpdateFormProps {
  student: StudentWithRelation;
  allSkills: Skill[];
}

const StudentUpdateForm = ({ student, allSkills }: StudentUpdateFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [firstNameError, setFirstNameError] = React.useState<string | null>(
    null
  );
  const [lastNameError, setLastNameError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      status: student.status,
      isAvailable: student.isAvailable,
      profilePicture: student.profilePicture?.url || "",
      cv: (student as any).CV?.url || "",
      description: student.description,
      skills: student.skills.map((skill) => skill.id),
    },
  });

  const validateName = (value: string) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    return nameRegex.test(value) || "Caractères spéciaux non autorisés";
  };

  const checkNameInput = (
    value: string,
    setError: (error: string | null) => void
  ) => {
    const regex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    if (!regex.test(value)) {
      setError("Caractères spéciaux non autorisés");
    } else {
      setError(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const uploadedFile = await UploadService.uploadFile(file);
      return uploadedFile.id;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erreur lors du téléchargement du fichier");
      return null;
    }
  };

  const handleProfilePictureChange = async (file: File) => {
    try {
      const uploadId = await handleFileUpload(file);
      if (uploadId) {
        await StudentService.updateStudent(student.id, {
          profilePictureId: uploadId,
        });
        queryClient.invalidateQueries({ queryKey: ["student", student.id] });
        toast.success("Photo de profil mise à jour");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil");
    }
  };

  const handleCVChange = async (file: File) => {
    try {
      const uploadId = await handleFileUpload(file);
      if (uploadId) {
        await StudentService.updateStudent(student.id, {
          CVId: uploadId,
        });
        queryClient.invalidateQueries({ queryKey: ["student", student.id] });
        toast.success("CV mis à jour");
      }
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Erreur lors de la mise à jour du CV");
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (firstNameError || lastNameError) {
      toast.error(
        "Veuillez corriger les erreurs dans le formulaire avant de continuer"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status,
        isAvailable: data.isAvailable,
        description: data.description || "",
        skillsId: data.skills,
        userId: student.userId,
        schoolId: student.schoolId,
        profilePictureId: student.profilePicture?.id || undefined,
        CVId: (student as any).CV?.id || undefined,
      };

      await StudentService.updateStudent(student.id, updateData);
      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      toast.success("Votre profil a été mis à jour avec succès");
    } catch (error: any) {
      console.error("Failed to update student:", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour de votre profil"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="w-[900px] h-full ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Mettez à jour votre profil étudiant
          </CardTitle>
          <CardDescription>
            Mettez à jour votre profil pour le rendre plus attractif pour les
            entreprises.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{
                        required: "Le prénom est requis",
                        validate: validateName,
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={firstNameError ? "border-red-500" : ""}
                              onChange={(e) => {
                                field.onChange(e);
                                checkNameInput(
                                  e.target.value,
                                  setFirstNameError
                                );
                              }}
                            />
                          </FormControl>
                          <div className="h-5">
                            {(fieldState.error || firstNameError) && (
                              <div className="text-red-500 text-xs whitespace-nowrap">
                                {firstNameError || fieldState.error?.message}
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      rules={{
                        required: "Le nom est requis",
                        validate: validateName,
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={lastNameError ? "border-red-500" : ""}
                              onChange={(e) => {
                                field.onChange(e);
                                checkNameInput(
                                  e.target.value,
                                  setLastNameError
                                );
                              }}
                            />
                          </FormControl>
                          <div className="h-5">
                            {(fieldState.error || lastNameError) && (
                              <div className="text-red-500 text-xs whitespace-nowrap">
                                {lastNameError || fieldState.error?.message}
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "stage"}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange("stage");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Stage</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "alternance"}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange("alternance");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Alternance
                            </FormLabel>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Disponible</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              {field.value && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 w-4/12">
                                  <img
                                    src="/file.svg"
                                    alt="CV icon"
                                    className="w-4 h-4 text-gray-300"
                                    style={{
                                      filter:
                                        "invert(90%) sepia(0%) saturate(0%) hue-rotate(153deg) brightness(90%) contrast(85%)",
                                    }}
                                  />
                                  <Link
                                    href={field.value}
                                    target="_blank"
                                    className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
                                  >
                                    CV actuel
                                  </Link>
                                </div>
                              )}
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    await handleCVChange(file);
                                  }
                                }}
                                disabled
                                className="w-8/12 cursor-not-allowed "
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo de profil</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {field.value && (
                              <div className="relative">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    src={field.value}
                                    alt="Profile"
                                    className="object-cover opacity-50"
                                  />
                                  <AvatarFallback className="opacity-50">
                                    {student.firstName?.[0]}
                                    {student.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-white/30"></div>
                              </div>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  await handleProfilePictureChange(file);
                                }
                              }}
                              disabled
                              className="cursor-not-allowed opacity-50"
                            />
                          </div>
                        </FormControl>
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compétences</FormLabel>
                        <FormControl>
                          <SkillsCombobox
                            selectedSkills={field.value}
                            onSkillsChange={field.onChange}
                            availableSkills={allSkills}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    firstNameError !== null ||
                    lastNameError !== null
                  }
                  className={`${
                    firstNameError || lastNameError
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentUpdateForm;
