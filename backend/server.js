import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { Client as PGClient } from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// PostgreSQL client (with Neon SSL fix)
const dbClient = new PGClient({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to DB and ensure tables exist
dbClient
  .connect()
  .then(async () => {
    console.log("✅ Connected to PostgreSQL");
    // await dbClient.query(`DROP TABLE IF EXISTS cart`);
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        picture TEXT
      )
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        item_name TEXT NOT NULL,
        quantity INT DEFAULT 1,
        price TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables ensured: users, cart");
  })
  .catch((err) => console.error("❌ DB connection error:", err));

// 1. Google login route
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ error: "Missing JWT_SECRET in server config" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // Create JWT
    const userJwt = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Insert user into DB
    await dbClient.query(
      `INSERT INTO users(id, email, name, picture)
       VALUES($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.email, user.name, user.picture]
    );

    res.json({ jwt: userJwt, user });
  } catch (err) {
    console.error("❌ Google Auth Error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// 2. Protected profile route
app.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const result = await dbClient.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    const userData = result.rows[0] || decoded;

    res.json({ user: userData });
  });
});

// 3. Add item to cart (UPDATED - includes price)
app.post("/cart/add", async (req, res) => {
  const { userId, itemName, quantity, price } = req.body;
  try {
    // Check if item already exists in cart
    const existingItem = await dbClient.query(
      `SELECT * FROM cart WHERE user_id = $1 AND item_name = $2`,
      [userId, itemName]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const result = await dbClient.query(
        `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND item_name = $3 RETURNING *`,
        [quantity || 1, userId, itemName]
      );
      res.json(result.rows[0]);
    } else {
      // Insert new item if it doesn't exist
      const result = await dbClient.query(
        `INSERT INTO cart (user_id, item_name, quantity, price)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, itemName, quantity || 1, price]
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error("❌ Cart insert/update error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// 4. Get user cart
app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await dbClient.query(
      "SELECT * FROM cart WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Update cart item quantity
app.put("/cart/update", async (req, res) => {
  const { itemId, quantity } = req.body;
  
  try {
    const result = await dbClient.query(
      `UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *`,
      [quantity, itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Cart update error:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

app.delete("/cart/remove/:itemId", async (req, res) => {
  const { itemId } = req.params;
  
  try {
    const result = await dbClient.query(
      `DELETE FROM cart WHERE id = $1 RETURNING *`,
      [itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("❌ Cart remove error:", err);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
