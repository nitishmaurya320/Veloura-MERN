import React, { useState } from "react";

export const StarRatingInput = ({ rating = 0, onChange, max = 5 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;

        return (
          <button
            type="button"
            key={i}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <span
              className={`text-2xl ${
                starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              } transition-colors`}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
};
