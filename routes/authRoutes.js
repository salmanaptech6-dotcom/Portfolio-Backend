const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  updateAdmin,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/profile", protect, updateAdmin);

module.exports = router;