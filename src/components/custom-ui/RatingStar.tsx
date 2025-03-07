import React from "react";
import { Star } from "lucide-react";
import { ReviewWithRelation } from "@/types/review.type";

const DisplayRating = ({
  review,
  totalStars = 5,
  size = 24,
  color = "#FFD700", // Gold/Yellow color
}: {
  review: ReviewWithRelation;
  totalStars?: number;
  size?: number;
  color?: string;
}) => {
  // Récupérer le rating de l'objet review
  const rating = review?.rating || 0;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const value = index + 1;

        return (
          <div key={index} className="cursor-default">
            <Star
              size={size}
              fill={rating >= value ? color : "transparent"}
              color={color}
              strokeWidth={1.5}
            />
          </div>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating} sur {totalStars}
      </span>
    </div>
  );
};

export default DisplayRating;
