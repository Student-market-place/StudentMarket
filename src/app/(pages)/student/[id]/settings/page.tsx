"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentProfilCard } from "@/components/custom-ui/StudentProfilCard";
import StudentUpdateForm from "@/components/custom-ui/StudentUpdateForm";
import UserService from "@/services/user.service";
import StudentService from "@/services/student.service";
import SkillService from "@/services/skill.service";
import { UserWithRelations } from "@/types/user.type";
import { StudentWithRelation } from "@/types/student.type";
import { Skill } from "@prisma/client";

// Composant de chargement
const SettingsLoading = () => (
  <div className="container max-w-5xl mx-auto p-6 space-y-8">
    <Skeleton className="h-10 w-1/3 mx-auto" />
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      <Skeleton className="h-[400px] w-[300px]" />
      <Skeleton className="h-[600px] w-full md:w-[500px]" />
    </div>
  </div>
);

const SettingsStudentPage = () => {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [student, setStudent] = useState<StudentWithRelation | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer l'ID de l'étudiant depuis les paramètres ou le localStorage
        const studentId = typeof params.id === "string" ? params.id : "";
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("Vous devez être connecté pour accéder à cette page.");
          setLoading(false);
          return;
        }

        // Récupérer les données de l'utilisateur connecté
        const userData = await UserService.fetchUserById(userId);
        
        if (!userData) {
          setError("Impossible de récupérer vos informations.");
          setLoading(false);
          return;
        }
        
        setUser(userData);

        // Récupérer les données d'étudiant si l'utilisateur est un étudiant mais que l'objet student est absent
        if (userData.role === "student" && !userData.student) {
          try {
            console.log("Tentative de récupération des données d'étudiant pour l'utilisateur:", userData.id);
            const studentsResponse = await fetch('/api/student/filter?userId=' + userData.id);
            
            if (!studentsResponse.ok) {
              throw new Error(`Aucun étudiant trouvé pour cet utilisateur (${studentsResponse.status}: ${studentsResponse.statusText})`);
            }
            
            const students = await studentsResponse.json();
            
            if (students && Array.isArray(students) && students.length > 0) {
              // Vérifier que l'étudiant appartient bien à l'utilisateur actuel
              const matchingStudent = students.find((s: any) => s.userId === userData.id);
              if (matchingStudent) {
                userData.student = matchingStudent;
                console.log("Données d'étudiant récupérées pour la page settings:", userData.student);
              } else {
                console.warn("⚠️ Étudiant trouvé mais avec un userId différent");
                setError("Erreur d'identification d'étudiant : données incohérentes.");
                setLoading(false);
                return;
              }
            } else {
              console.warn("⚠️ Aucun étudiant trouvé dans la réponse", students);
              setError("Aucune donnée d'étudiant trouvée pour votre compte.");
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Impossible de récupérer les données d'étudiant:", error);
            setError(`Impossible de récupérer les données d'étudiant: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            setLoading(false);
            return;
          }
        }

        // Vérifier si l'utilisateur peut accéder à cette page
        if (!userData || userData.role !== "student" || !userData.student) {
          setError("Vous n'êtes pas autorisé à accéder à cette page.");
          setLoading(false);
          return;
        }

        // Vérifier si l'ID de l'URL correspond à l'étudiant connecté
        if (studentId && studentId !== userData.student.id) {
          setError("Vous n'êtes pas autorisé à modifier ce profil d'étudiant.");
          setLoading(false);
          return;
        }

        // Récupérer les données détaillées de l'étudiant
        const studentData = await StudentService.fetchStudentById(userData.student.id);
        setStudent(studentData as StudentWithRelation);

        // Récupérer toutes les compétences disponibles
        const allSkills = await SkillService.fetchSkills();
        setSkills(allSkills);

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement de vos données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <SettingsLoading />;
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push("/home")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>Étudiant non trouvé</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push("/home")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl p-6 font-bold text-center text-gray-800 dark:text-white mt-6 mb-4 tracking-wide">
        👋 Paramètres de votre profil
      </h1>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start p-4">
        <div className="w-full md:w-1/3">
          <StudentProfilCard student={student} />
        </div>
        <div className="w-full md:w-2/3">
          <StudentUpdateForm student={student} allSkills={skills} />
        </div>
      </div>
    </div>
  );
};

export default SettingsStudentPage;
