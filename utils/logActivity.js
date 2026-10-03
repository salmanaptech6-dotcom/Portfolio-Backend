const Activity = require("../models/Activity");

const ICONS = {
  project: { create: "🚀", update: "✏️", delete: "🗑️", color: "#61dafb" },
  message: { create: "✉️", update: "📩", delete: "🗑️", color: "#4ade80" },
  skill:   { create: "⚡", update: "🔄", delete: "🗑️", color: "#facc15" },
  about:   { create: "📝", update: "✏️", delete: "🗑️", color: "#a78bfa" },
  resume:  { create: "📄", update: "📄", delete: "🗑️", color: "#f87171" },
  profile: { create: "👤", update: "✏️", delete: "🗑️", color: "#38bdf8" },
  auth:    { create: "🔐", update: "🔐", delete: "🔐", color: "#facc15" },
};

const logActivity = async ({ type, action, title, description = "", meta = {} }) => {
  try {
    const conf = ICONS[type]?.[action] || { create: "•", update: "•", delete: "•", color: "#ffffff" };
    await Activity.create({
      type,
      action,
      title,
      description,
      icon: typeof conf === "string" ? conf : conf.create,
      color: conf.color,
      meta,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

module.exports = logActivity;