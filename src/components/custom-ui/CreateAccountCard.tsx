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
import StudentService from "@/services/student.service";
import CompanyService from "@/services/company.service";
import SkillService from "@/services/skill.service";
import { Skill } from "@prisma/client";
import { SchoolResponseDto } from "@/types/dto/school.dto";
import { EnumStatusTYpe } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUpload } from "./FileUpload";
import { useRouter } from "next/navigation";

interface StudentFormValues {
  profilePicture: string;
  firstName: string;
  lastName: string;
  status: EnumStatusTYpe;
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
  const [schools, setSchools] = useState<SchoolResponseDto[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const isStudent = role === "student";
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis le localStorage
    const storedUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (storedUserId) {
      setUserId(storedUserId);

      // Vérifier si un profil étudiant ou entreprise existe déjà
      const checkExistingProfile = async () => {
        try {
          const studentData = await StudentService.fetchStudents({ userId: storedUserId });
          const companyData = await CompanyService.fetchCompanies();
          
          const hasStudentProfile = Array.isArray(studentData) && studentData.some(student => student.userId === storedUserId);
          const hasCompanyProfile = Array.isArray(companyData) && companyData.some(company => company.userId === storedUserId);
          
          if (hasStudentProfile || hasCompanyProfile) {
            router.push("/home");
            return;
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du profil:", error);
        }
      };

      checkExistingProfile();
      
      UserService.updateUserRole({
        userId: storedUserId,
        role: role,
      }).catch((error) => {
        console.error(
          "Erreur lors de la mise à jour du rôle de l'utilisateur:",
          error
        );
      });
    } else {
      console.error("❌ Aucun ID utilisateur trouvé dans le localStorage");
    }
  }, [role, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isStudent) {
          const [schoolsData, skillsData] = await Promise.all([
            SchoolService.fetchSchools(),
            SkillService.fetchSkills(),
          ]);

          console.log(schoolsData);
          console.log(skillsData);
          setSchools(schoolsData);
          setAvailableSkills(skillsData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [isStudent]);

  const studentForm = useForm<StudentFormValues>({
    defaultValues: {
      profilePicture: "",
      firstName: "",
      lastName: "",
      status: "stage",
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
      if (!userId) {
        return;
      }

      const studentData = {
        ...data,
        userId: userId,
      };

      await StudentService.createStudent(studentData);

      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création du profil étudiant:", error);
    }
  };

  const onCompanySubmit: SubmitHandler<CompanyFormValues> = async (data) => {
    try {
      if (!userId) {
        return;
      }

      const companyData = {
        ...data,
        userId: userId,
      };

      await CompanyService.createCompany(companyData);

      setTimeout(() => {
        router.push("/home");
      }, 1500);
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isStudent
            ? "Complétez votre profil étudiant"
            : "Complétez votre profil entreprise"}
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
            <form
              onSubmit={studentForm.handleSubmit(onStudentSubmit)}
              className="space-y-8"
            >
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                                checked={field.value === "stage"}
                                onCheckedChange={() =>
                                  field.onChange("stage")
                                }
                              />
                              <Label>Stage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === "alternance"}
                                onCheckedChange={() =>
                                  field.onChange("alternance")
                                }
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
                            selectedSkills={field.value}
                            availableSkills={availableSkills}
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
            <form
              onSubmit={companyForm.handleSubmit(onCompanySubmit)}
              className="space-y-8"
            >
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
