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
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
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
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running locally on port ${PORT}`)
  );
}

export default app;