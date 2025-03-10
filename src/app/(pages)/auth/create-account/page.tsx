"use client";

import CreateAccountCard from "@/components/custom-ui/CreateAccountCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const CreateAccountContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const router = useRouter();

  useEffect(() => {
    const checkUserAndInitialize = async () => {
      try {
        setIsLoading(true);
        
        if (!emailParam) {
          console.error("⚠️ Pas d'email dans l'URL");
          setIsLoading(false);
          return;
        }
        
        // Vérifier si un utilisateur existe avec cet email
        const response = await fetch(`/api/user?email=${encodeURIComponent(emailParam)}`);
        
        if (response.ok) {
          // L'utilisateur existe déjà
          const userData = await response.json();
          
          // Stocker l'ID dans le localStorage
          localStorage.setItem('userId', userData.id);
          
          // Vérifier si un profil étudiant ou entreprise existe déjà pour cet utilisateur
          const studentResponse = await fetch(`/api/student?userId=${userData.id}`);
          const companyResponse = await fetch(`/api/company?userId=${userData.id}`);

          // Vérifier si les réponses sont vides
          const studentText = await studentResponse.text();
          const companyText = await companyResponse.text();

          // Convertir en JSON si non vide
          const studentData = studentText ? JSON.parse(studentText) : null;
          const companyData = companyText ? JSON.parse(companyText) : null;
          
          // Vérifier si les données contiennent réellement un profil pour cet userId
          const hasStudentProfile = Array.isArray(studentData) && studentData.some(student => student.userId === userData.id);
          const hasCompanyProfile = Array.isArray(companyData) && companyData.some(company => company.userId === userData.id);
          
          if (hasStudentProfile || hasCompanyProfile) {
            router.push('/home');
            return;
          }
        } else if (response.status === 404) {
          // Utilisateur non trouvé, nous devons en créer un
          
          const createResponse = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailParam })
          });
          
          if (createResponse.ok) {
            const newUser = await createResponse.json();
            
            // Stocker l'ID dans le localStorage
            localStorage.setItem('userId', newUser.id);
          } else {
            console.error("❌ Erreur lors de la création de l'utilisateur:", await createResponse.text());
          }
        } else {
          console.error("❌ Erreur lors de la vérification de l'utilisateur:", await response.text());
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserAndInitialize();
  }, [emailParam, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Tabs defaultValue="student" className="w-[350px]">
        <TabsList className="w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <CreateAccountCard role="student" />
        </TabsContent>
        <TabsContent value="company">
          <CreateAccountCard role="company" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CreateAccountPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CreateAccountContent />
    </Suspense>
  );
};

export default CreateAccountPage;
