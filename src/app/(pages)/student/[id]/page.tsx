"use client";
import DisplayRating from "@/components/custom-ui/RatingStar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewService from "@/services/review.service";
import StudentService from "@/services/student.service";
import StudentHistoryService from "@/services/studentHistory.service";
import { ReviewWithRelation } from "@/types/review.type";
import { StudentWithRelation } from "@/types/student.type";
import { HistoryWithRelation } from "@/types/studentHistory.type";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const StudentProfilPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentWithRelation | null>(null);
  const [reviews, setReviews] = useState<ReviewWithRelation[]>([]);
  const [history, setHistory] = useState<HistoryWithRelation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      StudentService.fetchStudentById(id as string)
        .then((data) => setStudent(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      ReviewService.fetchReviews({ studentId: id as string })
        .then((data) => setReviews(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("fetching history", id);
      StudentHistoryService.fetchStudentsHistory({ studentId: id as string })
        .then((data) => {
          console.log("Historique récupéré :", data);
          setHistory(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${student.isAvailable ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <p>{student.isAvailable ? "Disponible" : "Non disponible"}</p>
        </div>
      </div>
      <div className="flex justify-between w-full py-10 px-30">
        <div className="flex flex-col gap-10  items-center">
          <Image
            src={student?.profilePicture?.url || "/default-avatar.png"}
            width={200}
            height={150}
            className="w-[200px] h-[150px] rounded-xl object-cover shadow-lg"
            alt="Photo de profil"
          />

          <div className="flex flex-col gap-5 items-center">
            <h2 className="text-xl font-bold">Biographie</h2>
            <p className="max-w-[500px]">{student.description}</p>
            <div className="flex justify-between w-full px-10">
              {student?.CV?.url && (
                <a href={student.CV.url} download>
                  <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                    Telecharger le CV
                  </Button>
                </a>
              )}
              <a href={`mailto:${student.user.email}`}>
                <Button className="bg-blue-500 hover:bg-blue-700 w-fit">
                  Contacter
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-8 w-fit border-2 shadow-lg border-secondary rounded-md h-fit">
          <Tabs
            defaultValue="infos"
            className="flex gap-8 items-center w-[400px] h-[300px]"
          >
            <TabsList className="flex gap-5">
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            <TabsContent value="infos">
              <ul className="flex flex-col gap-2">
                <li>
                  <span className="text-md font-bold">Ecole : </span>
                  {student.school.name}
                </li>
                <li>
                  <span className="text-md font-bold">Email :</span>{" "}
                  {student.user.email}
                </li>
                <li>
                  <span className="text-md font-bold">Poste souhaité :</span>{" "}
                  {student.status}
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="experience">
              <ul className="flex flex-col gap-1 mt-1">
                {history?.map((history, index) => (
                  <div key={index} className="flex flex-col gap-1 items-center">
                    <h3 className="text-md font-semibold">
                      {history?.company.name}
                    </h3>
                    <div className="flex gap-1 border-b-2 w-full pb-5">
                      <p>{new Date(history?.startDate).toLocaleDateString()}</p>
                      <p>-</p>
                      <p>
                        {history?.endDate
                          ? new Date(history.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="skills">
              <div className="flex flex-wrap gap-5 mt-1">
                {student?.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill?.name}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="flex flex-wrap gap-5 mt-1">
                {reviews.map((review, index) => (
                  <div key={index}>
                    <h3 className="text-md font-semibold">
                      {review?.company.name}
                    </h3>
                    <DisplayRating review={review} />
                    <p>{review?.comment}</p>
                  </div>
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
