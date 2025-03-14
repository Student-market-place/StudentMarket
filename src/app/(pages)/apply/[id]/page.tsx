"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CalendarIcon,
  Building2,
  Check,
  FileText,
} from "lucide-react";

import CompanyOfferService from "@/services/companyOffer.service";
import StudentApplyService from "@/services/studentApply.service";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";
import { StudentWithRelation } from "@/types/student.type";
import { Skill } from "@prisma/client";

// Page de chargement
const ApplyLoading = () => (
  <div className="container max-w-4xl mx-auto p-6 space-y-8">
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Schéma de validation du formulaire
const formSchema = z.object({
  message: z
    .string()
    .min(50, "Votre message doit contenir au moins 50 caractères")
    .max(1000, "Votre message est trop long (1000 caractères maximum)"),
});

type FormValues = z.infer<typeof formSchema>;

// Composant principal
const ApplyPage = () => {
  const params = useParams();
  const router = useRouter();
  const offerId = typeof params.id === "string" ? params.id : "";

  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Récupération des données de l'utilisateur connecté
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      UserService.fetchUserById(userId)
        .then(async (data) => {
          // Récupérer les données d'étudiant si l'utilisateur est un étudiant mais que l'objet student est absent
          if (data && data.role === "student" && !data.student) {
            try {
              console.log("Tentative de récupération des données d'étudiant pour l'utilisateur:", data.id);
              const studentsResponse = await fetch('/api/student/filter?userId=' + data.id);
              
              if (!studentsResponse.ok) {
                throw new Error('Aucun étudiant trouvé pour cet utilisateur');
              }
              
              const students = await studentsResponse.json();
              
              if (students && students.length > 0) {
                // Vérifier que l'étudiant appartient bien à l'utilisateur actuel
                const matchingStudent = students.find((s: any) => s.userId === data.id);
                if (matchingStudent) {
                  data.student = matchingStudent;
                  console.log("Données d'étudiant récupérées pour la page d'application:", data.student);
                } else {
                  console.warn("⚠️ Étudiant trouvé mais avec un userId différent");
                }
              }
            } catch (error) {
              console.error("Impossible de récupérer les données d'étudiant:", error);
            }
          }
          
          setUser(data);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement de l'utilisateur:", err);
          setError("Vous devez être connecté pour postuler à cette offre.");
        });
    } else {
      setError("Vous devez être connecté pour postuler à cette offre.");
    }
  }, []);

  // Récupération des données de l'offre
  const {
    data: offer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => CompanyOfferService.fetchCompanyOffer(offerId),
    enabled: !!offerId,
  });

  // Configuration du formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    // Vérifier que l'utilisateur est un étudiant
    if (!user || !user.student || user.role !== "student") {
      setError("Vous devez être un étudiant pour postuler à cette offre.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Créer la candidature
      await StudentApplyService.createStudentApply({
        studentId: user.student.id,
        companyOfferId: offerId,
        message: values.message,
        status: "en_attente",
      });

      setSuccess(true);

      // Rediriger après un court délai
      setTimeout(() => {
        router.push(`/student/applications`);
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission de la candidature:", err);
      setError(
        "Une erreur est survenue lors de la soumission de votre candidature. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) return <ApplyLoading />;

  if (isError || !offer) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Cette offre n&apos;existe pas ou a été supprimée.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push("/home")}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  console.log("User data:", user);  

  // Vérifier si l'utilisateur est un étudiant
  if (user.role !== "student" || !user.student) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès refusé</AlertTitle>
          <AlertDescription>
            Vous devez être un étudiant pour postuler à cette offre.
            Données disponibles: {JSON.stringify({
              role: user.role,
              hasStudentObject: !!user.student,
              studentId: user.student?.id
            })}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push("/home")}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">
          Postuler à l&apos;offre : {offer.title}
        </h1>
        <div className="flex items-center text-gray-600 mb-4">
          <Building2 className="h-5 w-5 mr-2" />
          <span className="font-medium">{offer.company?.name}</span>
        </div>
        <div className="flex gap-3">
          <Badge className="text-sm">{offer.type}</Badge>
          <span className="text-gray-500">
            Début : {new Date(offer.startDate).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">
            Candidature envoyée
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Votre candidature a été envoyée avec succès. Vous allez être
            redirigé vers vos candidatures.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Votre candidature</CardTitle>
              <CardDescription>
                Présentez-vous et expliquez pourquoi vous êtes intéressé par
                cette offre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="font-medium text-blue-800 mb-1">
                  {offer.title}
                </h4>
                <p className="text-sm text-blue-700">
                  Vous postulez pour cette offre chez {offer.company?.name}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message de candidature</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Présentez-vous, décrivez vos motivations et expliquez pourquoi vous êtes qualifié pour ce poste..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Soyez concis et précis. Mettez en avant vos
                          compétences qui correspondent à l&apos;offre.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.back()}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Envoi en cours..."
                        : "Envoyer ma candidature"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Détails de l&apos;offre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{offer.company?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>
                    Début :{" "}
                    {new Date(offer.startDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <Badge variant="secondary">{offer.type}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">
                  Description de l&apos;offre
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {offer.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Compétences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {offer.skills && offer.skills.length > 0 ? (
                    offer.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {typeof skill === "string" ? skill : skill.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      Aucune compétence spécifiée
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Votre profil</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.student.profilePicture?.url || ""}
                      alt={user.name || ""}
                    />
                    <AvatarFallback>
                      {user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.student.firstName} {user.student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(user.student as StudentWithRelation)?.skills &&
                  (user.student as StudentWithRelation).skills.length > 0 ? (
                    (user.student as StudentWithRelation).skills.map(
                      (skill: Skill) => (
                        <Badge
                          key={skill.id}
                          variant="outline"
                          className={
                            offer.skills?.some(
                              (s) =>
                                (typeof s === "string" ? s : s.name) ===
                                skill.name
                            )
                              ? "bg-green-50 text-green-700 border-green-200"
                              : ""
                          }
                        >
                          {skill.name}
                        </Badge>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      Aucune compétence spécifiée
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Composant avec Suspense
const ApplyWithSuspense = () => {
  return (
    <Suspense fallback={<ApplyLoading />}>
      <ApplyPage />
    </Suspense>
  );
};

export default ApplyWithSuspense;
