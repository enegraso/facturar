import express from "express";
import arca from "../services/arca.js";

const router = express.Router();

async function statusServer() {
    const status = await arca.electronicBillingService.getServerStatus();
    console.log("status:", status);
    return status;
}

async function puntosDeVenta() {
    const salesPoints = await arca.electronicBillingService.getSalesPoints();
    console.log("Puntos de venta:", salesPoints);
    return salesPoints;
}

router.get("/last/:ptoVta/:tipo", async (req, res) => {
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(arca)));
    try {

        const ptoVta = Number(req.params.ptoVta);
        const tipo = Number(req.params.tipo);
        puntosDeVenta();
        statusServer();
        const lastVoucher = await arca.electronicBillingService.getLastVoucher(
            ptoVta,
            tipo
        );

        res.status(200).json({
            ok: true,
            lastVoucher
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }
});

router.get("/status", async (req, res) => {
    try {
        const status = await statusServer();
        res.status(200).json({
            ok: true,
            status
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

router.get("/puntos", async (req, res) => {
    try {
        const salesPoints = await puntosDeVenta();
        const voucherTypes = await arca.electronicBillingService.getVoucherTypes();
        const conceptTypes = await arca.electronicBillingService.getConceptTypes();
        const documentTypes = await arca.electronicBillingService.getDocumentTypes();
        const aliquotTypes = await arca.electronicBillingService.getAliquotTypes();
        const currencies = await arca.electronicBillingService.getCurrenciesTypes();
        const taxTypes = await arca.electronicBillingService.getTaxTypes();
        res.status(200).json({
            ok: true,
            salesPoints,
            voucherTypes,
            conceptTypes,
            documentTypes,
            aliquotTypes,
            currencies,
            taxTypes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

router.post("/facturar", async (req, res) => {

    try {

        const data = req.body

        const voucher = await arca.electronicBillingService.createVoucher(data);

        res.json({
            ok: true,
            voucher
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

});

router.get("/info/:id/:ptoventa/:tipo", async (req, res) => {
    try {

        const id = Number(req.params.id);
        const ptoVta = Number(req.params.ptoventa);
        const tipo = Number(req.params.tipo);
        const voucherInfo = await arca.electronicBillingService.getVoucherInfo(id, ptoVta, tipo);

        if (voucherInfo) {
            console.log("Datos del comprobante:", voucherInfo);
        } else {
            console.log("El comprobante no existe.");
        }
        res.status(200).json({
            ok: true,
            voucherInfo
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

router.get("/contri/:cuit", async (req, res) => {
    try {
        const cuit = req.params.cuit;
        // Consultar datos del CUIT 20111111111
        const taxpayerDetails =
            await arca.registerScopeThirteenService.getTaxpayerDetails(cuit);

        if (taxpayerDetails) {
            console.log("Datos del contribuyente:", taxpayerDetails);
        } else {
            console.log("Contribuyente no encontrado.");
        }
        res.status(200).json({
            ok: true,
            taxpayerDetails
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
})

export default router