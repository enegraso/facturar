import fs from "fs";
import dotenv from "dotenv";
import { Arca } from "@arcasdk/core";

dotenv.config();

const arca = new Arca({
  cuit: 20279528787,
  cert: fs.readFileSync(process.env.FILECRT, "utf-8"),
  key: fs.readFileSync(process.env.FILEKEY, "utf-8"),
  production: true
});

export default arca;