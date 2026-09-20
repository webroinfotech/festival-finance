import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
// Password hash is derived at boot from ADMIN_PASSWORD so the plaintext
// is never compared directly (still a single shared admin account).
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const validUsername = username === ADMIN_USERNAME;
  const validPassword = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!validUsername || !validPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token, username, expiresIn: "12h" });
});

export default router;
