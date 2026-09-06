import jwt from "jsonwebtoken";
import pool from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret-change-me";

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      `SELECT c.*, u.username
       FROM companies c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [decoded.companyId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "Empresa no encontrada" });
    }

    req.company = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
}
