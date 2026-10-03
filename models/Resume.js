const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    title: { type: String, default: "My Resume" },
    description: {
      type: String,
      default:
        "A comprehensive document highlighting my technical skills, professional experience, projects, and educational background.",
    },
    fileUrl: { type: String, required: true },   // /uploads/resume-xxxx.pdf
    fileName: { type: String, required: true },  // original name
    fileSize: { type: Number },                  // in bytes
    fileType: { type: String },                  // application/pdf etc
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);