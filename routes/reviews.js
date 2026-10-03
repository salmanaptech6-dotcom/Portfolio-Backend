const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const protect = require("../middleware/authMiddleware"); // ← default export

/* ============================================================
   PUBLIC ROUTES
   ============================================================ */

/* GET /api/reviews — Only approved reviews (for About page) */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/reviews — Public submission (goes to pending) */
router.post("/", async (req, res) => {
  try {
    const { name, role, text, rating, image } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: "Name and text are required" });
    }
    const review = await Review.create({
      name,
      role,
      text,
      rating: rating || 5,
      image: image || "",
      approved: false,
    });
    res.status(201).json({ message: "Review submitted for approval", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   ADMIN ROUTES  (protected by `protect` middleware)
   ⚠️ Static paths BEFORE /:id paths
   ============================================================ */

/* GET /api/reviews/stats */
router.get("/stats", protect, async (req, res) => {
  try {
    const [total, approved, pending] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ approved: true }),
      Review.countDocuments({ approved: false }),
    ]);
    res.json({ total, approved, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/reviews/pending */
router.get("/pending", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/reviews/all */
router.get("/all", protect, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PATCH /api/reviews/:id/approve */
router.patch("/:id/approve", protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    const io = req.app.get("io");
    if (io) io.emit("review:new", review);

    res.json({ message: "Review approved", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PATCH /api/reviews/:id/reject */
router.patch("/:id/reject", protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review rejected", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/reviews/:id */
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;