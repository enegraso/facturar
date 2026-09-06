import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../db/connection.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("src", "certs", String(req.company.id));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname === "certCrt" ? "certificado.crt" : "clave.key";
    cb(null, name);
  },
});
const upload = multer({ storage });

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, razon_social, cuit, domicilio, email, telefono, condicion_iva, iibb, actividad, created_at
       FROM companies WHERE id = $1`,
      [req.company.id]
    );
    res.json({ ok: true, company: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { razon_social, cuit, domicilio, email, telefono, condicion_iva, iibb, actividad } = req.body;

    const result = await pool.query(
      `UPDATE companies
       SET razon_social = COALESCE($1, razon_social),
           cuit = COALESCE($2, cuit),
           domicilio = COALESCE($3, domicilio),
           email = COALESCE($4, email),
           telefono = COALESCE($5, telefono),
           condicion_iva = COALESCE($6, condicion_iva),
           iibb = COALESCE($7, iibb),
           actividad = COALESCE($8, actividad)
       WHERE id = $9
       RETURNING id, razon_social, cuit, domicilio, email, telefono, condicion_iva, iibb, actividad`,
      [razon_social, cuit, domicilio, email, telefono, condicion_iva, iibb, actividad, req.company.id]
    );

    res.json({ ok: true, company: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post(
  "/certificates",
  authMiddleware,
  upload.fields([
    { name: "certCrt", maxCount: 1 },
    { name: "certKey", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const crtPath = req.files["certCrt"] ? req.files["certCrt"][0].path : null;
      const keyPath = req.files["certKey"] ? req.files["certKey"][0].path : null;

      if (!crtPath || !keyPath) {
        return res.status(400).json({ ok: false, error: "Se requieren ambos archivos: certCrt y certKey" });
      }

      await pool.query(
        "UPDATE companies SET cert_crt_path = $1, cert_key_path = $2 WHERE id = $3",
        [crtPath, keyPath, req.company.id]
      );

      res.json({ ok: true, message: "Certificados subidos correctamente" });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);

router.get("/certificates", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT cert_crt_path, cert_key_path FROM companies WHERE id = $1",
      [req.company.id]
    );
    const company = result.rows[0];
    const hasCerts = !!(company.cert_crt_path && company.cert_key_path);
    res.json({ ok: true, hasCertificates: hasCerts });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
