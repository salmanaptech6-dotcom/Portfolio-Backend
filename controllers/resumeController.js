const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const logActivity = require("../utils/logActivity");

// GET /api/resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/resume  (upload)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description } = req.body;

    // Purane resume ko deactivate karo
    await Resume.updateMany({}, { isActive: false });

    const resume = await Resume.create({
      title: title || "My Resume",
      description: description || undefined,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      isActive: true,
    });

    res.status(201).json({ message: "Resume uploaded", data: resume });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/resume/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Not found" });

    // File system se delete karo
    const filePath = path.join(__dirname, "..", resume.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await resume.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};