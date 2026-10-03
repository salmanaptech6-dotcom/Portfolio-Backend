const express = require("express");
const router = express.Router();
const {
  getSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.get("/", getSkills);

// Admin (protected)
router.get("/admin/all", authMiddleware, getAdminSkills);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);
router.put("/reorder/bulk", authMiddleware, reorderSkills);

module.exports = router;