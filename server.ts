import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "tradevision-secret-key-123";
const db = new Database("tradevision.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    subscription_type TEXT DEFAULT 'none', -- 'none', 'weekly', 'monthly', 'trial'
    subscription_expiry DATETIME,
    has_used_trial INTEGER DEFAULT 0
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- API Routes ---

  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
      const result = stmt.run(email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET);
      res.json({ token, user: { email, subscription: 'none', has_used_trial: 0 } });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Server error" });
      }
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        subscription: user.subscription_type,
        expiry: user.subscription_expiry,
        has_used_trial: user.has_used_trial
      } 
    });
  });

  // Get User Profile
  app.get("/api/user/profile", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT email, subscription_type, subscription_expiry, has_used_trial FROM users WHERE id = ?").get(req.user.id) as any;
    res.json(user);
  });

  // Activate Free Trial
  app.post("/api/user/trial", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT has_used_trial FROM users WHERE id = ?").get(req.user.id) as any;
    
    if (user.has_used_trial) {
      return res.status(400).json({ error: "Free trial already used" });
    }

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24-hour trial

    db.prepare("UPDATE users SET subscription_type = 'trial', subscription_expiry = ?, has_used_trial = 1 WHERE id = ?")
      .run(expiry.toISOString(), req.user.id);

    res.json({ success: true, plan: 'trial', expiry: expiry.toISOString() });
  });

  // Subscribe (Simulated Payment)
  app.post("/api/user/subscribe", authenticate, (req: any, res) => {
    const { plan } = req.body; // 'weekly' or 'monthly'
    let durationDays = plan === 'weekly' ? 7 : 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);

    db.prepare("UPDATE users SET subscription_type = ?, subscription_expiry = ? WHERE id = ?")
      .run(plan, expiry.toISOString(), req.user.id);

    res.json({ success: true, plan, expiry: expiry.toISOString() });
  });

  // Market Analysis
  app.post("/api/market/analyze", authenticate, async (req: any, res) => {
    const { symbol, marketType } = req.body; // e.g., 'EURUSD', 'Forex'
    
    // Check subscription
    const user = db.prepare("SELECT subscription_type, subscription_expiry FROM users WHERE id = ?").get(req.user.id) as any;
    const now = new Date();
    const expiry = user.subscription_expiry ? new Date(user.subscription_expiry) : null;

    if (user.subscription_type === 'none' || (expiry && expiry < now)) {
      return res.status(403).json({ error: "Active subscription required" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Analyze the current global market for ${symbol} (${marketType}). 
        Provide a detailed technical and fundamental outlook.
        Include:
        1. Market Direction (Bullish/Bearish/Neutral)
        2. Precise Entry Price
        3. Take Profit (TP) Level
        4. Stop Loss (SL) Level
        5. Reasoning based on current global economic news and technical indicators.
        
        Format the response as JSON with keys: direction, entry, tp, sl, reasoning, symbol.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
