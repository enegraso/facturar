import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function Dashboard() {
  const { logout } = useAuth();
  const [company, setCompany] = useState(null);
  const [status, setStatus] = useState(null);
  const [puntos, setPuntos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [comp, st, pt] = await Promise.all([
          api.getCompany(),
          api.getStatus(),
          api.getPuntos(),
        ]);
        setCompany(comp.company);
        setStatus(st.status);
        setPuntos(pt);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      <section>
        <h3>Empresa</h3>
        {company && (
          <ul>
            <li><strong>Razón Social:</strong> {company.razon_social}</li>
            <li><strong>CUIT:</strong> {company.cuit}</li>
            <li><strong>Domicilio:</strong> {company.domicilio || "-"}</li>
            <li><strong>Email:</strong> {company.email || "-"}</li>
            <li><strong>Teléfono:</strong> {company.telefono || "-"}</li>
            <li><strong>IVA:</strong> {company.condicion_iva || "-"}</li>
            <li><strong>IIBB:</strong> {company.iibb || "-"}</li>
            <li><strong>Actividad:</strong> {company.actividad || "-"}</li>
          </ul>
        )}
      </section>

      <section>
        <h3>Estado ARCA</h3>
        {status && (
          <ul>
            <li>App Server: {status.appServer}</li>
            <li>DB Server: {status.dbServer}</li>
            <li>Auth Server: {status.authServer}</li>
          </ul>
        )}
      </section>

      <section>
        <h3>Puntos de Venta</h3>
        {puntos?.salesPoints?.resultGet?.ptoVenta?.length > 0 ? (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Emisión</th>
                <th>Bloqueado</th>
              </tr>
            </thead>
            <tbody>
              {puntos.salesPoints.resultGet.ptoVenta.map((pv) => (
                <tr key={pv.nro}>
                  <td>{pv.nro}</td>
                  <td>{pv.emisionTipo}</td>
                  <td>{pv.bloqueado === "N" ? "No" : "Sí"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay puntos de venta disponibles</p>
        )}
      </section>
    </div>
  );
}
