CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  razon_social VARCHAR(200) NOT NULL,
  cuit VARCHAR(11) NOT NULL,
  domicilio TEXT,
  email VARCHAR(100),
  telefono VARCHAR(30),
  condicion_iva VARCHAR(50),
  iibb VARCHAR(50),
  actividad VARCHAR(100),
  cert_crt_path VARCHAR(500),
  cert_key_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
