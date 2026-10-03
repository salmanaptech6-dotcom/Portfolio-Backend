const Skill = require("../models/Skill");
const logActivity = require("../utils/logActivity");
// GET all (public - only active)
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all for admin (including inactive)
exports.getAdminSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    await logActivity({
      type: "skill",
      action: "create",
      title: "New skill added",
      description: skill.name,
      meta: { id: skill._id },
    });
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: "Not found" });
    await logActivity({
      type: "skill",
      action: "update",
      title: "Skill updated",
      description: skill.name,
      meta: { id: skill._id },
    });
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Not found" });
    await logActivity({
      type: "skill",
      action: "delete",
      title: "Skill deleted",
      description: skill.name,
    });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// BULK reorder
exports.reorderSkills = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    await Promise.all(
      items.map((it) => Skill.findByIdAndUpdate(it.id, { order: it.order }))
    );
    res.json({ success: true, message: "Reordered" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
