import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth.js";
import helloRoute from "./routes/hello.js";
import boxesRouter from "./routes/boxes.js";
import storagesRouter from "./routes/storages.js";
import userRouter from "./routes/user.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://keeeply.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/hello", helloRoute);
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxesRouter);
app.use("/api/storages", storagesRouter);
app.use("/api/user", userRouter);

// Test
app.get("/api", (req, res) => res.send("Hello from API!"));

export default app;