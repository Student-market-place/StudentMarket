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
      ReviewService.fetchReviewsByStudent(id as string)
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
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <div className="animate-pulse bg-gray-200 rounded-xl w-full max-w-md h-32 flex items-center justify-center">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 w-full max-w-md">
          <p className="text-red-600 text-center">Étudiant non trouvé</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* En-tête du profil */}
      <div className="flex flex-col items-center mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {student.firstName} {student.lastName}
        </h1>
        <h3 className="text-lg text-center">En recherche {student.status}</h3>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-2 h-2 rounded-full ${student.isAvailable ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <p className="text-sm">{student.isAvailable ? "Disponible" : "Non disponible"}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Colonne gauche: photo + bio + boutons */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 items-center">
          <div className="w-full flex justify-center">
            <Image
              src={student?.profilePicture?.url || "/default-avatar.png"}
              width={200}
              height={200}
              className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-xl object-cover shadow-lg"
              alt="Photo de profil"
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-xl font-bold text-center">Biographie</h2>
            <p className="text-sm md:text-base text-center">{student.description || "Aucune biographie disponible"}</p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center w-full mt-2">
              {student?.CV?.url && (
                <a href={student.CV.url} download className="w-full sm:w-auto">
                  <Button className="w-full bg-blue-500 hover:bg-blue-700">
                    Télécharger le CV
                  </Button>
                </a>
              )}
              <a href={`mailto:${student.user.email}`} className="w-full sm:w-auto">
                <Button className="w-full bg-blue-500 hover:bg-blue-700">
                  Contacter
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Colonne droite: tabs avec infos */}
        <div className="w-full lg:w-2/3">
          <div className="border-2 shadow-lg border-secondary rounded-md p-4 md:p-6">
            <Tabs defaultValue="infos" className="w-full">
              <TabsList className="flex flex-wrap gap-2 mb-4 w-full">
                <TabsTrigger value="infos" className="flex-1">Informations</TabsTrigger>
                <TabsTrigger value="skills" className="flex-1">Compétences</TabsTrigger>
                <TabsTrigger value="experience" className="flex-1">Expérience</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Avis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos" className="pt-2">
                <ul className="flex flex-col gap-3">
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-bold">École :</span>
                    <span>{student.school.name}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-bold">Email :</span>
                    <span>{student.user.email}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-bold">Poste souhaité :</span>
                    <span>{student.status}</span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="experience" className="pt-2">
                {history && history.length > 0 ? (
                  <ul className="flex flex-col gap-4">
                    {history.map((item, index) => (
                      <li key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <h3 className="font-semibold">{item?.company.name}</h3>
                        <div className="flex gap-1 text-sm text-gray-600 mt-1">
                          <p>{new Date(item?.startDate).toLocaleDateString()}</p>
                          <p>-</p>
                          <p>
                            {item?.endDate
                              ? new Date(item.endDate).toLocaleDateString()
                              : "Présent"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucune expérience renseignée</p>
                )}
              </TabsContent>

              <TabsContent value="skills" className="pt-2">
                {student?.skills && student.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill?.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune compétence renseignée</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-2">
                {reviews && reviews.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <h3 className="font-semibold">{review?.company.name}</h3>
                        <DisplayRating review={review} />
                        <p className="text-sm mt-1">{review?.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun avis pour le moment</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilPage;
