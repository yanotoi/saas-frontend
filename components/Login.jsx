import { useState } from "react";
import { loginUser, registerUser } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(data));
      onLogin(data);
    } catch {
      alert("Error en login");
    }
  };

  const register = async () => {
    await registerUser(email, password);
    alert("Usuario creado");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Ingresar</button>
      <button onClick={register}>Registrarse</button>
    </div>
  );
}