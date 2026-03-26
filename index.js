import express from "express";
import cors from "cors";
import morgan from "morgan";
import invoiceRoutes from "./src/routes/invoices.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/invoice", invoiceRoutes);

 app.get('/invoice', (req, res) => {
    return res.status(200).json({ message: "BackEnd for Facturar: " })
  })

app.listen(3008, () => {
  console.log("ARCA API running");
});