import { Review } from "@/types/review.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/review`;

async function fetchReviews(
    params: Review
): Promise<Review[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/review`;

  const queryObject: Record<string, number> = {};
  if (params.rating !== undefined) {
    queryObject.status = params.rating;
  }

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchReview(id: string): Promise<Review> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

async function postReview(review: Review): Promise<Review> {
  const response = await axios.post(END_POINT, review);
  return response.data;
}

async function putReview(review: Review): Promise<Review> {
  const response = await axios.put(`${END_POINT}/${review.id}`, review);
  return response.data;
}

async function deleteReview(review: Review): Promise<Review> {
  const response = await axios.delete(`${END_POINT}/${review.id}`);
  return response.data;
}

const ReviewService = {
  fetchReviews,
  fetchReview,
  postReview,
  putReview,
  deleteReview,
};

export default ReviewService;