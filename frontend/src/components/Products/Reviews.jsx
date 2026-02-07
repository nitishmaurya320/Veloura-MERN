import React, { useEffect, useRef, useState } from "react";
import { StarRating } from "./StarRating";
import { StarRatingInput } from "./StarRatingInput";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Reviews = ({
  reviews = [],
  handleSubmitOrEdit,
  userId,
  productId,
  handleDelete,
  isEditing,
  setIsEditing,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    const review = reviews.find(
      (review) => review.userId?._id === userId,
    )?.comment;
    setComment(review || "");
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mt-6 text-[13px]">
      <h3 className="text-[15px] font-semibold mb-3">Customer Reviews</h3>

      {/* Add / Edit Review */}
      {(!reviews.some((r) => r?.userId?._id === userId) || isEditing) && (
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <label className="block mb-2 font-medium">
            {isEditing ? "Edit your review" : "Write a review"}
          </label>

          <textarea
            ref={inputRef}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            className="w-full resize-none rounded-md border px-3 py-2 outline-none focus:border-black mb-2"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <StarRatingInput rating={rating} onChange={setRating} />

            <button
              onClick={(e) => {
                handleSubmitOrEdit(e, comment, rating);
                setComment("");
                setRating(0);
              }}
              className="bg-[#9B2A90] hover:bg-[#7E1F75] text-white px-4 py-1.5 rounded-md  transition"
            >
              {isEditing ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* No Reviews */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {review.userId?.name || "Anonymous"}
                  </p>
                  <StarRating rating={review.rating} />
                </div>

                {review?.userId?._id === userId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpen(open === review._id ? null : review._id)
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <BiDotsVerticalRounded size={18} />
                    </button>

                    {open === review._id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-md z-10">
                        <button
                          onClick={() => {
                            setOpen(null);
                            handleEdit();
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setOpen(null);
                            handleDelete(productId);
                          }}
                          className="w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comment */}
              <p className="mt-2 text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
