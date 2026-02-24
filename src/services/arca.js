import fs from "fs";
import { Arca } from "@arcasdk/core";

const arca = new Arca({
  cuit: 20279528787,
  cert: fs.readFileSync("./src/certs/Servicios Informáticos Bragado_f24bb9beb59fe21.crt", "utf-8"),
  key: fs.readFileSync("./src/certs/clave.key", "utf-8"),
  production: true
});

export default arca;