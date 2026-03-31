import { useEffect, useState } from "react";
import Clients from "../components/Clients";
import Login from "../components/Login";
import Products from "../components/Products";
import Orders from "../components/Orders";
import { API } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const loadProducts = () =>
    fetch(`${API}/products?user_id=${user.id}`)
      .then(r => r.json())
      .then(setProducts);

  const loadOrders = () =>
    fetch(`${API}/orders?user_id=${user.id}`)
      .then(r => r.json())
      .then(setOrders);

  const loadClients = () =>
    fetch(`${API}/clients?user_id=${user.id}`)
      .then(r => r.json())
      .then(setClients);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
    }
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <button onClick={logout}>Cerrar sesión</button>
      <h1>Sistema de Pedidos y Stock</h1>
      <Products
        products={products}
        setProducts={setProducts}
        user={user}
        loadProducts={loadProducts}
      />
      <Clients
        clients={clients}
        setClients={setClients}
        user={user}
        loadClients={loadClients}
      />
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