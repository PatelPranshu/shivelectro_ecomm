import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {

  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      className={`p-2 rounded-full transition-colors ${
        handleRatingChange ? 'group' : 'pointer-events-none'
      } ${
        star <= rating
          ? "text-yellow-500 hover:bg-slate-900"
          : "text-slate-900 hover:bg-slate-900"
      }`}
      variant="outline"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`w-6 h-6 transition-colors ${
          star <= rating 
            ? "fill-yellow-500 group-hover:fill-primary group-hover:text-primary" 
            : "fill-slate-900 group-hover:fill-primary group-hover:text-primary"
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
