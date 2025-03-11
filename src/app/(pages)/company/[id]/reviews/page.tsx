"use client";

import { useState, useEffect } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StudentHistoryService from "@/services/studentHistory.service";
import ReviewService from "@/services/review.service";
import { useParams } from "next/navigation";
import { HistoryWithRelation } from "@/types/studentHistory.type";
import { ReviewWithRelation } from "@/types/review.type";
import { Star } from "lucide-react";
import CardStudent from "@/components/custom-ui/CardStudent";

const CompanyReviewsPage = () => {
  const { id: companyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState<HistoryWithRelation[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviews, setReviews] = useState<{
    [key: string]: ReviewWithRelation[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;

      try {
        const historiesData = await StudentHistoryService.fetchStudentsHistory({
          companyId: companyId as string,
        });

        setHistories(historiesData);

        const reviewsPromises = historiesData.map((history) =>
          ReviewService.fetchReviewsByStudent(history.student.id)
        );

        const reviewsData = await Promise.all(reviewsPromises);

        const reviewsMap = historiesData.reduce(
          (acc, history, index) => {
            acc[history.student.id] = reviewsData[index];
            return acc;
          },
          {} as { [key: string]: ReviewWithRelation[] }
        );

        setReviews(reviewsMap);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !rating || !comment) return;

    try {
      const reviewData = {
        studentId: selectedStudent,
        companyId: companyId as string,
        rating,
        comment,
      };

      await ReviewService.postReview(reviewData);

      // Reset form
      setSelectedStudent(null);
      setRating(0);
      setComment("");

      // Refresh reviews for the student
      const updatedReviews =
        await ReviewService.fetchReviewsByStudent(selectedStudent);
      setReviews((prev) => ({
        ...prev,
        [selectedStudent]: updatedReviews,
      }));
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Évaluations des Étudiants</h1>

      <div className="flex gap-8">
        <div>
          <div className="w-full gap-4 grid grid-cols-2 ">
            {histories.map((history) => (
              <div
                key={history.id}
                className="flex gap-4 items-center p-4 border-2 rounded-xl"
              >
                <div className="mb-4">
                  <CardStudent student={history.student} />
                </div>

                {/* Affichage des commentaires existants */}
                {reviews[history.student.id]?.length > 0 && (
                  <div className="ml-4">
                    <div className="flex justify-end">
                      <Button
                        className="top-2 right-2"
                        onClick={() => setSelectedStudent(history.student.id)}
                      >
                        Évaluer
                      </Button>
                    </div>
                    <h3 className="text-sm font-semibold mb-2">
                      Commentaires précédents :
                    </h3>
                    <div className="space-y-2">
                      {reviews[history.student.id].map((review) => (
                        <Card key={review.id} className="p-3">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                size={16}
                                fill={
                                  value <= review.rating
                                    ? "#FFD700"
                                    : "transparent"
                                }
                                color="#FFD700"
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire d'évaluation */}
        {selectedStudent && (
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Note</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={24}
                          className="cursor-pointer"
                          fill={
                            value <= (hoveredRating || rating)
                              ? "#FFD700"
                              : "transparent"
                          }
                          color="#FFD700"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHoveredRating(value)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Commentaire</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Votre commentaire sur l'étudiant..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" disabled={!rating || !comment}>
                    Soumettre l&aposévaluation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyReviewsPage;
