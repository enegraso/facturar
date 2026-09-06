import fs from "fs";
import { Arca } from "@arcasdk/core";

export function createArcaInstance(cuit, certPath, keyPath) {
  const cert = fs.readFileSync(certPath, "utf-8");
  const key = fs.readFileSync(keyPath, "utf-8");

  return new Arca({
    cuit,
    cert,
    key,
    production: true,
  });
}
