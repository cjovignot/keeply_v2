// server/api/routes/auth.ts
import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { safeUser } from "../utils/safeUser";
import { GoogleTokenResponse } from "../types/googleAuth/index.js";
import { createUser, findUserByEmail } from "../controllers/userController";

const router = Router();

const BACKEND_REDIRECT_URI = `${process.env.BACKEND_URL}/api/auth/google/callback`;

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// ------------------------------------------------------
// 1️⃣ Google OAuth URL
// ------------------------------------------------------
router.get("/google/url", (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: BACKEND_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options as Record<string, string>);
  const url = `${rootUrl}?${qs.toString()}`;

  res.json({ url });
});

// ------------------------------------------------------
// 2️⃣ Google Callback
// ------------------------------------------------------
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const tokenRequestBody = new URLSearchParams({
      code: code as string,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: BACKEND_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { data } = await axios.post<GoogleTokenResponse>(
      "https://oauth2.googleapis.com/token",
      tokenRequestBody,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = data;

    const { data: userInfo } = await axios.get<GoogleUserInfo>(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    let user = await findUserByEmail(userInfo.email);

    if (!user) {
      user = await createUser({
        name: userInfo.name,
        email: userInfo.email,
        password: "-", // mot de passe dummy pour Google
        provider: "google",
      });
    }

    const token = jwt.sign(safeUser(user)!, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  } catch (err) {
    console.error("[CALLBACK] ❌ Error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

// ------------------------------------------------------
// 3️⃣ Signup (email/password)
// ------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Utilisateur déjà existant" });

    const user = await createUser({ name, email, password });

    const token = jwt.sign(safeUser(user)!, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ------------------------------------------------------
// 4️⃣ Login (email/password)
// ------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user)
      return res.status(400).json({ message: "Utilisateur non trouvé" });

    if (!user.password)
      return res.status(400).json({
        message: "Utilisateur créé via Google, utilisez Google Login",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(safeUser(user)!, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ------------------------------------------------------
// 5️⃣ Logout
// ------------------------------------------------------
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// ------------------------------------------------------
// 6️⃣ /me
// ------------------------------------------------------
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ user: null });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

export default router;
