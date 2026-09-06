import express from "express";
import { createArcaInstance } from "../services/arca.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

function getArca(req) {
  const { cuit, cert_crt_path, cert_key_path } = req.company;
  return createArcaInstance(cuit, cert_crt_path, cert_key_path);
}

router.get("/status", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const status = await arca.electronicBillingService.getServerStatus();
    res.json({ ok: true, status });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get("/puntos", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const salesPoints = await arca.electronicBillingService.getSalesPoints();
    const voucherTypes = await arca.electronicBillingService.getVoucherTypes();
    const conceptTypes = await arca.electronicBillingService.getConceptTypes();
    const documentTypes = await arca.electronicBillingService.getDocumentTypes();
    const aliquotTypes = await arca.electronicBillingService.getAliquotTypes();
    const currencies = await arca.electronicBillingService.getCurrenciesTypes();
    const taxTypes = await arca.electronicBillingService.getTaxTypes();
    res.json({
      ok: true,
      salesPoints,
      voucherTypes,
      conceptTypes,
      documentTypes,
      aliquotTypes,
      currencies,
      taxTypes,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get("/last/:ptoVta/:tipo", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const ptoVta = Number(req.params.ptoVta);
    const tipo = Number(req.params.tipo);
    const lastVoucher = await arca.electronicBillingService.getLastVoucher(ptoVta, tipo);
    res.json({ ok: true, lastVoucher });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.post("/facturar", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const data = req.body;
    const voucher = await arca.electronicBillingService.createVoucher(data);
    res.json({ ok: true, voucher });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get("/info/:id/:ptoventa/:tipo", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const id = Number(req.params.id);
    const ptoVta = Number(req.params.ptoventa);
    const tipo = Number(req.params.tipo);
    const voucherInfo = await arca.electronicBillingService.getVoucherInfo(id, ptoVta, tipo);
    res.json({ ok: true, voucherInfo });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get("/contri/:cuit", authMiddleware, async (req, res) => {
  try {
    const arca = getArca(req);
    const cuit = req.params.cuit;
    const taxpayerDetails = await arca.registerScopeThirteenService.getTaxpayerDetails(cuit);
    res.json({ ok: true, taxpayerDetails });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
