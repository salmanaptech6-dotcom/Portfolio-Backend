const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStats,
  clearActivity,
  getUnreadCount,
} = require("../controllers/dashboardController");

router.get("/stats", authMiddleware, getStats);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.delete("/activity", authMiddleware, clearActivity);

module.exports = router;