const express = require("express");
const router = express.Router();
const {
  getAbout,
  createOrUpdateAbout,
  updateAbout,
} = require("../controllers/aboutController");

const protect = require("../middleware/authMiddleware");
// Public
router.get("/", getAbout);

// Protected (admin only)
router.post("/", protect, createOrUpdateAbout);
router.put("/:id", protect, updateAbout);

module.exports = router;