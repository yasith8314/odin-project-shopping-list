const express = require("express");
const auth = require("../middleware/auth");
const Review = require("../models/Review");

const router = express.Router();
const MAX_COMMENT_LENGTH = 2_000;

const positiveInteger = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const validateReview = ({ gameId, rating, comment }, requireGameId = true) => {
  const parsedGameId = positiveInteger(gameId);
  const parsedRating = Number(rating);
  const parsedComment = typeof comment === "string" ? comment.trim() : "";

  if (requireGameId && !parsedGameId) return { error: "A valid gameId is required." };
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) return { error: "Rating must be an integer from 1 to 5." };
  if (!parsedComment || parsedComment.length > MAX_COMMENT_LENGTH) return { error: `Comment must be between 1 and ${MAX_COMMENT_LENGTH} characters.` };
  return { gameId: parsedGameId, rating: parsedRating, comment: parsedComment };
};

router.get("/", async (req, res) => {
  const gameId = positiveInteger(req.query.gameId);
  if (!gameId) return res.status(400).json({ error: "A valid gameId is required." });

  try {
    const [reviews, summary] = await Promise.all([Review.findByGameId(gameId), Review.getSummary(gameId)]);
    return res.json({ reviews, summary: { reviewCount: Number(summary.reviewCount), averageRating: Number(summary.averageRating) } });
  } catch (error) {
    console.error("Unable to get reviews:", error);
    return res.status(500).json({ error: "Unable to load reviews." });
  }
});

router.post("/", auth, async (req, res) => {
  const values = validateReview(req.body);
  if (values.error) return res.status(400).json({ error: values.error });

  try {
    const review = await Review.create(req.userId, values.gameId, values.rating, values.comment);
    return res.status(201).json({ review });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "You have already reviewed this game. Edit your existing review instead." });
    console.error("Unable to create review:", error);
    return res.status(500).json({ error: "Unable to save review." });
  }
});

router.put("/:reviewId", auth, async (req, res) => {
  const reviewId = positiveInteger(req.params.reviewId);
  const values = validateReview(req.body, false);
  if (!reviewId) return res.status(400).json({ error: "A valid review ID is required." });
  if (values.error) return res.status(400).json({ error: values.error });

  try {
    const review = await Review.update(reviewId, req.userId, values.rating, values.comment);
    if (!review) return res.status(404).json({ error: "Review not found." });
    return res.json({ review });
  } catch (error) {
    console.error("Unable to update review:", error);
    return res.status(500).json({ error: "Unable to update review." });
  }
});

router.delete("/:reviewId", auth, async (req, res) => {
  const reviewId = positiveInteger(req.params.reviewId);
  if (!reviewId) return res.status(400).json({ error: "A valid review ID is required." });

  try {
    const removed = await Review.remove(reviewId, req.userId);
    if (!removed) return res.status(404).json({ error: "Review not found." });
    return res.status(204).end();
  } catch (error) {
    console.error("Unable to delete review:", error);
    return res.status(500).json({ error: "Unable to delete review." });
  }
});

module.exports = router;
