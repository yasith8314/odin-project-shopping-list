import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { trackEvent } from "../analytics";

const getReviews = async (gameId) => (await api.get(`/reviews?gameId=${gameId}`)).data;

const Rating = ({ value }) => <span className="rating-stars" aria-label={`${value} out of 5 stars`}>{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}</span>;

const Reviews = ({ gameId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["reviews", gameId], queryFn: () => getReviews(gameId) });
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reviews = data?.reviews || [];
  const ownReview = reviews.find((review) => review.userId === user?.id);

  useEffect(() => {
    if (editingId && ownReview?.id === editingId) {
      setRating(String(ownReview.rating));
      setComment(ownReview.comment);
    }
  }, [editingId, ownReview]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["reviews", gameId] });
  const resetForm = () => { setRating("5"); setComment(""); setEditingId(null); };

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { gameId, rating: Number(rating), comment };
      if (editingId) await api.put(`/reviews/${editingId}`, payload);
      else await api.post("/reviews", payload);
      if (!editingId) trackEvent("review_created", { gameId });
      await refresh();
      resetForm();
      showToast(editingId ? "Review updated." : "Review published.");
    } catch (error) {
      showToast(error.response?.data?.error || "Couldn't save your review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!ownReview || !window.confirm("Delete your review?")) return;
    setSubmitting(true);
    try {
      await api.delete(`/reviews/${ownReview.id}`);
      await refresh();
      resetForm();
      showToast("Review deleted.");
    } catch (error) {
      showToast(error.response?.data?.error || "Couldn't delete your review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="reviews" aria-labelledby={`reviews-title-${gameId}`}>
    <div className="reviews-heading">
      <h3 id={`reviews-title-${gameId}`}>Community reviews</h3>
      {data && <p><Rating value={data.summary.averageRating} /> {data.summary.averageRating.toFixed(1)} · {data.summary.reviewCount} {data.summary.reviewCount === 1 ? "review" : "reviews"}</p>}
    </div>

    {isLoading && <p className="reviews-state">Loading reviews…</p>}
    {isError && <div className="reviews-error"><p className="reviews-state">Reviews are unavailable right now.</p><button type="button" onClick={() => refetch()}>Try again</button></div>}
    {!isLoading && !isError && !reviews.length && <p className="reviews-state">Be the first to review this game.</p>}

    {!editingId && ownReview && <div className="own-review-actions"><button type="button" onClick={() => setEditingId(ownReview.id)}>Edit your review</button><button type="button" className="text-danger" onClick={deleteReview} disabled={submitting}>Delete</button></div>}

    {!ownReview || editingId ? <form className="review-form" onSubmit={submitReview}>
      <h4>{editingId ? "Edit your review" : "Write a review"}</h4>
      <label>Rating
        <select value={rating} onChange={(event) => setRating(event.target.value)} disabled={submitting}>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? "" : "s"}</option>)}
        </select>
      </label>
      <label>Review
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength="2000" required disabled={submitting} placeholder="What should other players know?" />
      </label>
      <div className="review-form-actions"><button type="submit" disabled={submitting}>{submitting ? "Saving…" : editingId ? "Save changes" : "Publish review"}</button>{editingId && <button type="button" onClick={resetForm} disabled={submitting}>Cancel</button>}</div>
    </form> : null}

    <div className="review-list">
      {reviews.map((review) => <article className="review" key={review.id}>
        <div><Rating value={review.rating} /><span className="review-author">GameScout member</span></div>
        <p>{review.comment}</p>
        <time dateTime={review.createdAt}>Posted {new Date(review.createdAt).toLocaleDateString()}</time>
      </article>)}
    </div>
  </section>;
};

export default Reviews;
