import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API ! 👋" });
});

export default router;
