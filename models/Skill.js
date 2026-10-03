const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Database", "Tools", "Other"],
    },
    level: { type: Number, required: true, min: 0, max: 100 },
    color: { type: String, default: "#ffffff" },
    icon: { type: String, default: "" }, // initials ya icon text
    order: { type: Number, default: 0 },
    isLearning: { type: Boolean, default: false }, // currently learning section
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);