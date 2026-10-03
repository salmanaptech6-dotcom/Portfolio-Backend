const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    // ---- Hero / Header ----
    label: { type: String, default: "About Me" },
    titleMain: { type: String, default: "Who" },
    titleAccent: { type: String, default: "I Am" },

    // ---- Basic Info ----
    name: { type: String, required: true },
    role: { type: String, required: true },
    focus: { type: String, required: true },
    status: { type: String, default: "Available for work" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },

    // ---- Main Content ----
    leadText: { type: String, required: true },
    paragraphs: [{ type: String }],

    // ---- Tech Stack (grouped) ----
    techStack: [{ type: String }],

    // ---- Info Grid (bottom) ----
    infoGrid: [
      {
        label: { type: String },
        value: { type: String },
        isStatus: { type: Boolean, default: false },
      },
    ],

    // ---- Extra Skills (naya section) ----
    skills: [
      {
        category: { type: String },       // Frontend, Backend, Database
        items: [{ type: String }],        // React, Node.js, etc.
      },
    ],

    // ---- Education / Experience (optional detailed) ----
    education: [
      {
        title: { type: String },
        institute: { type: String },
        year: { type: String },
      },
    ],

    experience: [
      {
        title: { type: String },
        company: { type: String },
        year: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);