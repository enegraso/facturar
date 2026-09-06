import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/connection.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret-change-me";

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      razon_social,
      cuit,
      domicilio,
      email,
      telefono,
      condicion_iva,
      iibb,
      actividad,
    } = req.body;

    if (!username || !password || !razon_social || !cuit) {
      return res.status(400).json({
        ok: false,
        error: "Faltan campos obligatorios: username, password, razon_social, cuit",
      });
    }

    const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "El usuario ya existe" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
      [username, password_hash]
    );
    const userId = userResult.rows[0].id;

    const companyResult = await pool.query(
      `INSERT INTO companies (user_id, razon_social, cuit, domicilio, email, telefono, condicion_iva, iibb, actividad)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [userId, razon_social, cuit, domicilio || null, email || null, telefono || null, condicion_iva || null, iibb || null, actividad || null]
    );
    const companyId = companyResult.rows[0].id;

    const token = jwt.sign({ userId, companyId }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ ok: true, token, companyId });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Faltan campos: username, password" });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const companyResult = await pool.query("SELECT id FROM companies WHERE user_id = $1 LIMIT 1", [user.id]);
    if (companyResult.rows.length === 0) {
      return res.status(400).json({ ok: false, error: "El usuario no tiene empresa asociada" });
    }

    const companyId = companyResult.rows[0].id;
    const token = jwt.sign({ userId: user.id, companyId }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ ok: true, token, companyId });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
