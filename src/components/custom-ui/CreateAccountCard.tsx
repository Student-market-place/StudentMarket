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
import { useEffect, useState } from "react";
import UserService from "@/services/user.service";
import SchoolService from "@/services/school.service";
import { User, School } from "@prisma/client";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUpload } from "./FileUpload";

interface StudentFormValues {
  profilePicture: string;
  firstName: string;
  lastName: string;
  status: string;
  isAvailable: boolean;
  CV: string;
  skills: string[];
  description: string;
  schoolId: string;
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
  const [latestUser, setLatestUser] = useState<User | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const isStudent = role === "student";
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const user = await UserService.fetchLatestUser();
        setLatestUser(user);
        if (user) {
          await UserService.updateUserRole({
            userId: user.id,
            role: role
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };
    fetchLatestUser();
  }, [role]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsList = await SchoolService.fetchSchools();
        setSchools(schoolsList);
      } catch (error) {
        console.error("Erreur lors de la récupération des écoles:", error);
      }
    };
    fetchSchools();
  }, []);

  const studentForm = useForm<StudentFormValues>({
    defaultValues: {
      profilePicture: "",
      firstName: "",
      lastName: "",
      status: "",
      isAvailable: false,
      CV: "",
      skills: [],
      description: "",
      schoolId: "",
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
    try {
      if (!latestUser) {
        console.error("Aucun utilisateur trouvé");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      await axios.post(`${baseUrl}/api/student`, {
        ...data,
        userId: latestUser.id
      });

      console.log("Profil étudiant créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du profil étudiant:", error);
    }
  };

  const onCompanySubmit: SubmitHandler<CompanyFormValues> = async (data) => {
    try {
      if (!latestUser) {
        console.error("Aucun utilisateur trouvé");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      await axios.post(`${baseUrl}/api/company`, {
        ...data,
        userId: latestUser.id
      });

      console.log("Profil entreprise créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du profil entreprise:", error);
    }
  };

  const handleImageUploadComplete = (imageUrl: string) => {
    if (isStudent) {
      studentForm.setValue("profilePicture", imageUrl);
    } else {
      companyForm.setValue("profilePicture", imageUrl);
    }
    setProfilePictureUrl(imageUrl);
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
                    fallback={isStudent ? "S" : "C"}
                    onUploadComplete={handleImageUploadComplete}
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
                  <FormField
                    control={studentForm.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>École</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre école" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="CV"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept=".pdf,.doc,.docx"
                            onUploadComplete={(url) => field.onChange(url)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={studentForm.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compétences</FormLabel>
                        <FormControl>
                          <SkillsCombobox
                            onSkillsChange={(skills) => field.onChange(skills)}
                            defaultSkills={field.value}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                <FormLabel>Logo de l&apos;entreprise</FormLabel>
                <AvatarUpload
                  fallback={isStudent ? "S" : "C"}
                  onUploadComplete={handleImageUploadComplete}
                />
              </FormItem>

              <FormField
                control={companyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l&apos;entreprise</FormLabel>
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
                    <FormLabel>Description de l&apos;entreprise</FormLabel>
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
