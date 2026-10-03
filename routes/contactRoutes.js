const express = require("express");

const {
  createContact,
  getContacts,
  getContact,
  deleteContact,
} = require("../controllers/contactController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/", createContact);

// Admin Only
router.get("/", protect, getContacts);
router.get("/:id", protect, getContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;