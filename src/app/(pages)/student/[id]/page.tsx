"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentService from "@/services/student.service";
import { StudentWithRelation } from "@/types/student.type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Remove the props interface since we'll be fetching the data directly
const StudentProfilPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentWithRelation | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (student?.CV?.url) {
      await StudentService.downloadCV(student.CV.url);
    }
  };

  useEffect(() => {
    if (id) {
      StudentService.fetchStudentById(id as string)
        .then((data) => setStudent(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  // Handle case when student data couldn't be loaded
  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        Étudiant non trouvé
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">
          {student.firstName} {student.lastName}
        </h1>
        <h3>En recherche {student.status}</h3>
      </div>
      <div className="flex justify-between w-full py-10 px-30">
        <div className="flex flex-col gap-10 justify-between items-center">
          <img
            src={student.profilePicture.url}
            className="w-[200px] h-[150px] rounded-xl object-cover shadow-lg"
            alt="Photo de profil"
          />

          <div className="flex flex-col gap-5 items-center">
            <h2 className="text-xl font-bold">Biographie</h2>
            <p className="max-w-[500px]">{student.description}</p>
            <div className="flex justify-between w-full px-30">
              <Button
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-700 w-fit"
              >
                Telecharger le CV
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                Contacter
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-8 w-fit border-2 shadow-lg border-secondary rounded-md h-fit">
          <Tabs defaultValue="infos" className="flex items-center w-[400px]">
            <TabsList className="flex gap-5">
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
            </TabsList>
            <TabsContent value="infos">
              <h2>Informations</h2>
              <ul>
                <li>{student.school.name}</li>
                <li>{student.isAvailable}</li>
                <li>{student.status}</li>
              </ul>
            </TabsContent>

            <TabsContent value="experience">
              <h2>Expériences</h2>
              {/* <ul className="flex flex-wrap gap-1 mt-1">
                {student?.studentHistories.map((history, index) => (
                  <li key={index}>{history?.startDate.toLocaleDateString()}</li>
                ))}
              </ul> */}
            </TabsContent>

            <TabsContent value="skills">
              <h2>Compétences</h2>
              <div className="flex flex-wrap gap-1 mt-1">
                {student?.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill?.name}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilPage;
