import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import invoiceRoutes from "./src/routes/invoices.js";
import authRoutes from "./src/routes/auth.js";
import companyRoutes from "./src/routes/companies.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/companies", companyRoutes);
app.use("/invoice", invoiceRoutes);

const frontPath = path.resolve("front", "dist");
app.use(express.static(frontPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontPath, "index.html"));
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`ARCA API running on port ${PORT}`);
});
