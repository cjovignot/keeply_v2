// server/api/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth";
import helloRoute from "./routes/hello";
import boxesRouter from "./routes/boxes";
import storagesRouter from "./routes/storages";
import userRouter from "./routes/user";

const app = express();

// ⚡ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://keeeply.vercel.app"],
    credentials: true, // important pour cookies
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(cookieParser()); // ✅ doit être avant tes routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // ✅ obligatoire pour envoyer le cookie
  })
);

// Routes
app.use("/api/hello", helloRoute);
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxesRouter);
app.use("/api/storages", storagesRouter);
app.use("/api/user", userRouter);

// Route test
app.get("/api", (req, res) => res.send("Hello from API!"));

// ⚡ Écoute locale seulement
if (process.env.VERCEL === undefined) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running locally on port ${PORT}`)
  );
}

// Needed for Vercel serverless functi