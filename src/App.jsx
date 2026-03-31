import { useEffect, useState } from "react";
import Clients from "./components/Clients";
import Products from "./components/Products";
import Orders from "./components/Orders";

const API = "https://saas-backend-production-5adc.up.railway.app";

function App() {
  const [user, setUser] = useState(null);

  // Login/Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Datos cargados
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);

  // ======================
  // AUTH
  // ======================
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return alert("Error login");
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const register = async () => {
    await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    alert("Usuario creado");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ======================
  // CARGAR DATOS
  // ======================
  const loadProducts = () =>
    fetch(`${API}/products?user_id=${user.id}`).then((r) => r.json()).then(setProducts);
  const loadOrders = () =>
    fetch(`${API}/orders?user_id=${user.id}`).then((r) => r.json()).then(setOrders);
  const loadClients = () =>
    fetch(`${API}/clients?user_id=${user.id}`).then((r) => r.json()).then(setClients);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
    }
  }, [user]);

  // ======================
  // LOGIN UI
  // ======================
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Ingresar</button>
        <button onClick={register}>Registrarse</button>
      </div>
    );
  }

  // ======================
  // APP UI
  // ======================
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <button onClick={logout}>Cerrar sesión</button>
      <h1>Sistema de Pedidos y Stock</h1>
      <p>Controlá tus pedidos, stock y entregas en un solo lugar</p>

      <hr />
      <Products
        products={products}
        setProducts={setProducts}
        user={user}
        loadProducts={loadProducts}
      />

      <hr />
      <Clients
        clients={clients}
        setClients={setClients}
        user={user}
        loadClients={loadClients}
      />

      <hr />
      <Orders
        orders={orders}
        setOrders={setOrders}
        products={products}
        user={user}
        loadOrders={loadOrders}
        loadProducts={loadProducts}
        clients={clients}
      />
    </div>
  );
}

export default App;