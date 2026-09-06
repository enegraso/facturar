const API_BASE = "";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body }),
  register: (body) => request("/auth/register", { method: "POST", body }),
  getCompany: () => request("/companies"),
  updateCompany: (body) => request("/companies", { method: "PUT", body }),
  uploadCertificates: (formData) =>
    request("/companies/certificates", { method: "POST", body: formData }),
  getCertificates: () => request("/companies/certificates"),
  getStatus: () => request("/invoice/status"),
  getPuntos: () => request("/invoice/puntos"),
  getLastVoucher: (ptoVta, tipo) => request(`/invoice/last/${ptoVta}/${tipo}`),
  facturar: (body) => request("/invoice/facturar", { method: "POST", body }),
};
