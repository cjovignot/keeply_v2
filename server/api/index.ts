import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Route de test principale
app.get("/api", (req: Request, res: Response) => {
  res.send("Hello from the application API!");
});

// Routes
import helloRoute from "./routes/hello";
import authRouter from "./routes/auth";
import boxesRouter from "./routes/boxes";
import storagesRouter from "./routes/storages";
import userRouter from "./routes/user";
app.use("/api/hello", helloRoute);
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxesRouter);
app.use("/api/storages", storagesRouter);
app.use("/api/user", userRouter);

// On démarre le serveur SEULEMENT en local
if (process.env.VERCEL === undefined) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

export default app;
