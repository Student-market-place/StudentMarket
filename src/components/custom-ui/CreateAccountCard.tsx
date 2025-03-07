"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { SkillsCombobox } from "./SkillsCombobox";
import { AvatarUpload } from "./AvatarUpload";
import { Textarea } from "../ui/textarea";

interface StudentFormValues {
  profilePicture: string;
  firstName: string;
  lastName: string;
  status: string;
  isAvailable: boolean;
  CVId: string;
  skills: string[];
  description: string;
}

interface CompanyFormValues {
  profilePicture: string;
  name: string;
  description: string;
}

interface CreateAccountCardProps {
  role: "student" | "company";
}

const CreateAccountCard = ({ role }: CreateAccountCardProps) => {
  const isStudent = role === "student";

  const studentForm = useForm<StudentFormValues>({
    defaultValues: {
      profilePicture: "",
      firstName: "",
      lastName: "",
      status: "",
      isAvailable: false,
      CVId: "",
      skills: [],
      description: "",
    },
  });

  const companyForm = useForm<CompanyFormValues>({
    defaultValues: {
      profilePicture: "",
      name: "",
      description: "",
    },
  });

  const onStudentSubmit: SubmitHandler<StudentFormValues> = async (data) => {
    console.log("Student form data:", data);
    // TODO: Implémenter la logique de soumission pour les étudiants
  };

  const onCompanySubmit: SubmitHandler<CompanyFormValues> = async (data) => {
    console.log("Company form data:", data);
    // TODO: Implémenter la logique de soumission pour les entreprises
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isStudent ? "Complétez votre profil étudiant" : "Complétez votre profil entreprise"}
        </CardTitle>
        <CardDescription>
          {isStudent 
            ? "Remplissez vos informations pour que les entreprises puissent vous connaître."
            : "Remplissez les informations de votre entreprise pour commencer à recruter."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isStudent ? (
          <Form {...studentForm}>
            <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-8">
              <div className="flex justify-end gap-7">
                <FormItem className="w-1/3 flex flex-col items-center">
                  <FormLabel>Photo de profil</FormLabel>
                  <AvatarUpload
                    fallback=" "
                    onUpload={async (file) => {
                      console.log("Uploading file:", file.name);
                      await new Promise((resolve) => setTimeout(resolve, 1500));
                      console.log("Upload complete!");
                    }}
                  />
                </FormItem>

                <div className="w-full max-w-[280px] flex flex-col space-y-4">
                  <FormField
                    control={studentForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={studentForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-7">
                <div className="w-1/3 flex flex-col space-y-10">
                  <FormField
                    control={studentForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de contrat recherché</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === "internship"}
                                onCheckedChange={() => field.onChange("internship")}
                              />
                              <Label>Stage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === "apprenticeship"}
                                onCheckedChange={() => field.onChange("apprenticeship")}
                              />
                              <Label>Alternance</Label>
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={studentForm.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="isAvailable"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="isAvailable">Disponible</Label>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-2/3 flex flex-col space-y-4">
                  <FormField
                    control={studentForm.control}
                    name="CVId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Compétences</FormLabel>
                    <SkillsCombobox />
                  </FormItem>
                </div>
              </div>

              <FormField
                control={studentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Parlez-nous de vous..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="cursor-pointer">
                Enregistrer
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-8">
              <FormItem className="flex flex-col items-center">
                <FormLabel>Logo de l'entreprise</FormLabel>
                <AvatarUpload
                  fallback=" "
                  onUpload={async (file) => {
                    console.log("Uploading file:", file.name);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    console.log("Upload complete!");
                  }}
                />
              </FormItem>

              <FormField
                control={companyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de votre entreprise" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={companyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description de l'entreprise</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre entreprise..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="cursor-pointer">
                Enregistrer
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateAccountCard;
