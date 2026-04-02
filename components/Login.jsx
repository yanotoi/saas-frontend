import { useState } from "react";
import { loginUser, registerUser } from "../src/api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const data = await loginUser(email, password);

      if (!data.token) return alert("Credenciales incorrectas");

      // 🔥 Guarda TODO (incluye role automáticamente)
      localStorage.setItem("user", JSON.stringify(data));

      onLogin(data);
    } catch {
      alert("Error en login");
    }
  };

  const register = async () => {
    try {
      const data = await registerUser(email, password);

      if (!data.token) return alert("Error al registrarse");

      // 🔥 También guarda role si backend lo manda
      localStorage.setItem("user", JSON.stringify(data));

      onLogin(data);

      alert("Usuario creado y logueado");
    } catch {
      alert("Error al registrarse");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={login}>Ingresar</button>
        <button onClick={register}>Registrarse</button>
      </div>
    </div>
  );
}