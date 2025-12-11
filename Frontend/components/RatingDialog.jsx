/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

const RatingDialog = ({ open, setOpen, ride, onSubmit, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleSubmit = async () => {
    if (!rating || !feedback.trim()) {
      alert("Please provide both rating and feedback before submitting.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rate`,
        {
          rideId: ride._id,
          rating,
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (onSubmit) onSubmit();
      closeDialog();
    } catch (err) {
      console.log("Rating error:", err);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setRating(0);
    setFeedback("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Rate your Ride
        </h2>

        {/* Rating */}
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`ri-star-fill text-3xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            ></i>
          ))}
        </div>

        {/* Feedback */}
        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none"
          rows="3"
          placeholder="Share your feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            className="w-full bg-black text-white py-2 rounded-lg font-medium"
            onClick={handleSubmit}
          >
            Submit Rating
          </button>

          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium"
            onClick={() => {
              if (onSkip) onSkip();
              closeDialog();
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingDialog;
