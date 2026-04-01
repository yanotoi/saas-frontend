import { useEffect, useState, useCallback } from "react";
import Clients from "../components/Clients";
import Login from "../components/Login";
import Products from "../components/Products";
import Orders from "../components/Orders";
import { fetchProducts, fetchOrders, fetchClients } from "./api";

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

  const loadProducts = useCallback(() => {
    if (!user) return;
    fetchProducts(user.id).then(data =>
      setProducts(Array.isArray(data) ? data : [])
    );
  }, [user]);

  const loadOrders = useCallback(() => {
    if (!user) return;
    fetchOrders(user.id).then(data =>
      setOrders(Array.isArray(data) ? data : [])
    );
  }, [user]);

  const loadClients = useCallback(() => {
    if (!user) return;
    fetchClients(user.id).then(data =>
      setClients(Array.isArray(data) ? data : [])
    );
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
    }
  }, [user, loadProducts, loadOrders, loadClients]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <button onClick={logout}>Cerrar sesión</button>
      <h1>Sistema de Pedidos y Stock</h1>

      <Products products={products} />

      <Clients
        clients={clients}
        user={user}
        loadClients={loadClients}
      />

      <Orders
        orders={orders}
        clients={clients}
      />
    </div>
  );
}

export default App;