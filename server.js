require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const projectRoutes   = require("./routes/projectRoutes");
const contactRoutes   = require("./routes/contactRoutes");
const authRoutes      = require("./routes/authRoutes");
const aboutRoute      = require("./routes/about");
const resumeRoute     = require("./routes/resume");
const skillRoutes     = require("./routes/skills");
const dashboardRoutes = require("./routes/dashboard");
const reviewRoutes    = require("./routes/reviews");

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://salmanbanisai.netlify.app/",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Portfolio API is running...",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/reviews",   reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/skills",    skillRoutes);
app.use("/api/projects",  projectRoutes);
app.use("/api/contacts",  contactRoutes);
app.use("/api/auth",      authRoutes);
app.use("/api/about",     aboutRoute);
app.use("/api/resume",    resumeRoute);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error(" Server Error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(" Socket disconnected:", socket.id, "|", reason);
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
  });
}

process.on("SIGINT", () => {
  console.log("\n Shutting down gracefully...");
  server.close(() => {
    console.log(" Server closed.");
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(" Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
  process.exit(1);
});

module.exports = { app, server, io };