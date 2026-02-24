import express from "express";
import cors from "cors";
import invoiceRoutes from "./src/routes/invoices.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoice", invoiceRoutes);

app.listen(3008, () => {
  console.log("ARCA API running");
});