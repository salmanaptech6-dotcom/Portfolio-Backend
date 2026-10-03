const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getResume,
  uploadResume,
  deleteResume,
} = require("../controllers/resumeController");
const  protect  = require("../middleware/authMiddleware");

router.get("/", getResume);
router.post("/", protect, upload.single("resume"), uploadResume);
router.delete("/:id", protect, deleteResume);

module.exports = router;