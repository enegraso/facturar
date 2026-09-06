import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    razon_social: "",
    cuit: "",
    domicilio: "",
    email: "",
    telefono: "",
    condicion_iva: "",
    iibb: "",
    actividad: "",
  });
  const [certCrt, setCertCrt] = useState(null);
  const [certKey, setCertKey] = useState(null);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api.register(form);

      if (certCrt && certKey) {
        const fd = new FormData();
        fd.append("certCrt", certCrt);
        fd.append("certKey", certKey);

        const token = data.token;
        localStorage.setItem("token", token);
        await api.uploadCertificates(fd);
      }

      login(data.token, data.companyId);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Datos de usuario</legend>
          <div>
            <label>Usuario</label><br />
            <input name="username" value={form.username} onChange={handleChange} />
          </div>
          <div>
            <label>Contraseña</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos de la empresa</legend>
          <div>
            <label>Razón Social *</label><br />
            <input name="razon_social" value={form.razon_social} onChange={handleChange} />
          </div>
          <div>
            <label>CUIT *</label><br />
            <input name="cuit" value={form.cuit} onChange={handleChange} />
          </div>
          <div>
            <label>Domicilio</label><br />
            <input name="domicilio" value={form.domicilio} onChange={handleChange} />
          </div>
          <div>
            <label>Email</label><br />
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono</label><br />
            <input name="telefono" value={form.telefono} onChange={handleChange} />
          </div>
          <div>
            <label>Condición IVA</label><br />
            <input name="condicion_iva" value={form.condicion_iva} onChange={handleChange} />
          </div>
          <div>
            <label>IIBB</label><br />
            <input name="iibb" value={form.iibb} onChange={handleChange} />
          </div>
          <div>
            <label>Actividad</label><br />
            <input name="actividad" value={form.actividad} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Certificados ARCA</legend>
          <div>
            <label>Certificado .crt</label><br />
            <input type="file" accept=".crt" onChange={(e) => setCertCrt(e.target.files[0])} />
          </div>
          <div>
            <label>Clave .key</label><br />
            <input type="file" accept=".key" onChange={(e) => setCertKey(e.target.files[0])} />
          </div>
        </fieldset>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
}
