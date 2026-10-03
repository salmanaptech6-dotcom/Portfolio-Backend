const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["project", "message", "skill", "about", "resume", "profile", "auth"],
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "update", "delete", "login"],
      required: true,
    },
    title: { type: String, required: true },       // "New project added"
    description: { type: String, default: "" },    // "Portfolio Website"
    icon: { type: String, default: "•" },
    color: { type: String, default: "#ffffff" },
    meta: { type: Object, default: {} },           // extra data
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);