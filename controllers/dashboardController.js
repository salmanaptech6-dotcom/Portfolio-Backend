const Project = require("../models/Project");
const Contact = require("../models/Contact");
const Skill = require("../models/Skill");
const Activity = require("../models/Activity");
const mongoose = require("mongoose");
const logActivity = require("../utils/logActivity");

// ============ GET DASHBOARD STATS ============
exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // ===== COUNTS =====
    const [
      totalProjects,
      totalMessages,
      totalSkills,
      unreadMessages,
      projectsThisMonth,
      projectsLastMonth,
      messagesThisMonth,
      messagesLastMonth,
      skillsThisMonth,
      skillsLastMonth,
    ] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments(),
      Skill.countDocuments(),
      Contact.countDocuments({ isRead: false }),   // agar aapke Contact model me isRead field hai
      Project.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Project.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Skill.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Skill.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    // ===== TRENDS =====
    const calcTrend = (curr, prev) => {
      if (prev === 0 && curr === 0) return { value: "0%", up: true };
      if (prev === 0) return { value: `+${curr}`, up: true };
      const pct = Math.round(((curr - prev) / prev) * 100);
      return { value: `${pct >= 0 ? "+" : ""}${pct}%`, up: pct >= 0 };
    };

    // ===== SPARKLINE (last 7 days) =====
    const buildSparkline = async (Model) => {
      const data = await Model.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]);

      const map = {};
      data.forEach((d) => (map[d._id] = d.count));

      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split("T")[0];
        result.push(map[key] || 0);
      }
      return result;
    };

    const [projectSpark, messageSpark, skillSpark] = await Promise.all([
      buildSparkline(Project),
      buildSparkline(Contact),
      buildSparkline(Skill),
    ]);

    // ===== RECENT ACTIVITY (last 10) =====
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);

    // ===== RECENT MESSAGES (last 5 unread) =====
    const recentMessages = await Contact.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject createdAt");

    // ===== SYSTEM HEALTH =====
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? "Healthy" : "Down";
    const dbPing = dbState === 1 ? 100 : 0;

    const memory = process.memoryUsage();
    const memUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
    const memTotalMB = Math.round(memory.heapTotal / 1024 / 1024);
    const memPct = Math.round((memUsedMB / memTotalMB) * 100);

    const uptimeSec = process.uptime();
    const serverPct = 100; // Always 100 if responding

    res.json({
      success: true,
      data: {
        stats: {
          projects: {
            total: totalProjects,
            trend: calcTrend(projectsThisMonth, projectsLastMonth),
            spark: projectSpark,
          },
          messages: {
            total: totalMessages,
            unread: unreadMessages,
            trend: calcTrend(messagesThisMonth, messagesLastMonth),
            spark: messageSpark,
          },
          skills: {
            total: totalSkills,
            trend: calcTrend(skillsThisMonth, skillsLastMonth),
            spark: skillSpark,
          },
          uptime: {
            seconds: Math.floor(uptimeSec),
            label: formatUptime(uptimeSec),
          },
        },
        activities,
        recentMessages,
        health: {
          server: { status: "Online", pct: serverPct },
          database: { status: dbStatus, pct: dbPing },
          memory: { status: `${memUsedMB} MB`, pct: memPct },
        },
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

function formatUptime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ============ CLEAR ACTIVITY (optional) ============
exports.clearActivity = async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.json({ success: true, message: "Activity cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============ GET UNREAD COUNT (for bell) ============
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};