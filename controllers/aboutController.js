const About = require("../models/About");
const logActivity = require("../utils/logActivity");

// GET /api/about
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // agar kuch nahi hai toh empty skeleton bhej do
      return res.status(200).json(null);
    }
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/about  (create ya replace)
exports.createOrUpdateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (about) {
      about = await About.findByIdAndUpdate(about._id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({
        message: "About updated successfully",
        data: about,
      });
    }

    about = await About.create(req.body);
    res.status(201).json({
      message: "About created successfully",
      data: about,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/about/:id
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.status(200).json({
      message: "About updated successfully",
      data: about,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};