const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 60 },
    role:     { type: String, trim: true, maxlength: 80, default: "" },
    text:     { type: String, required: true, trim: true, maxlength: 500 },
    rating:   { type: Number, min: 1, max: 5, default: 5 },
    image:    { type: String, default: "" }, // optional avatar URL
    approved: { type: Boolean, default: false }, // admin must approve
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);