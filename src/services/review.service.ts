import { GetAllParams, Review, ReviewWithRelation } from "@/types/review.type";
import axios from "axios";

async function fetchReviews(
  params: GetAllParams
): Promise<ReviewWithRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/review`;

  const queryObject: Record<string, number> = {};
  if (params.rating !== undefined) {
    queryObject.status = params.rating;
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchReview(id: string): Promise<ReviewWithRelation> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/review/${id}`;

  const response = await axios.get(url);
  return response.data;
}

async function fetchReviewsByStudent(
  id: string
): Promise<ReviewWithRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/review/student/${id}`;
  const response = await axios.get(url);
  return response.data;
}

async function postReview(reviewData: Partial<Review>): Promise<Review> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/review`;
  const response = await axios.post(url, reviewData);
  return response.data;
}

// async function putReview(review: Review): Promise<Review> {
//   const response = await axios.put(`${END_POINT}/${review.id}`, review);
//   return response.data;
// }

// async function deleteReview(review: Review): Promise<Review> {
//   const response = await axios.delete(`${END_POINT}/${review.id}`);
//   return response.data;
// }

const ReviewService = {
  fetchReviews,
  fetchReview,
  postReview,
  // putReview,
  // deleteReview,
  fetchReviewsByStudent,
};

export default ReviewService;
