import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import helloRoute from "./routes/hello";

const app = express();

app.use(cors());
app.use(express.json());

// Route de test principale
app.get("/api", (req: Request, res: Response) => {
  res.send("Hello from the application API!");
});

// Route séparée
app.use("/api/hello", helloRoute);

// On démarre le serveur SEULEMENT en local
if (process.env.VERCEL === undefined) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

export default app;
