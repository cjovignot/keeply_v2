// server/api/index.ts
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

// ⚡ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://keeeply.vercel.app"],
    credentials: true, // important pour cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/hello", helloRoute);
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxesRouter);
app.use("/api/storages", storagesRouter);
app.use("/api/user", userRouter);

// Route test
app.get("/api", (req, res) => res.send("Hello from API!"));

// ⚡ Écoute locale seulement
// if (process.env.VERCEL === undefined) {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () =>
//     console.log(`🚀 Server running locally on port ${PORT}`)
//   );
// }

export default app;
