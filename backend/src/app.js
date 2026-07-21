import express from "express";
import cors from "cors";
import morgan from "morgan";

import repositoryRoutes from "./routes/repositoryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

const app = express();

/* ---------------- Global Middleware ---------------- */

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

/* ---------------- Routes ---------------- */

app.use("/api/repository", repositoryRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/mentor", mentorRoutes);

/* ---------------- Health Check ---------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 ProjectMemory Backend is Running",
  });
});

export default app;