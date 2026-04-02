import { useEffect, useState, useCallback } from "react";
import Clients from "../components/Clients";
import Login from "../components/Login";
import Products from "../components/Products";
import Orders from "../components/Orders";
import {
  fetchProducts,
  fetchOrders,
  fetchClients,
  createProduct as apiCreateProduct,
  createOrder as apiCreateOrder,
  deliverOrder as apiDeliverOrder
} from "./api";

function App() {
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [orders, setOrders] = useState([]);
  const [clientName, setClientName] = useState("");
  const [filter, setFilter] = useState("");

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ==========================
  // LOADERS
  // ==========================
  const loadProducts = useCallback(async () => {
    if (!user) return;
    const data = await fetchProducts(user.id);
    setProducts(
      Array.isArray(data)
        ? data.map(p => ({
            ...p,
            price: Number(p.price),
            stock: Number(p.stock)
          }))
        : []
    );
  }, [user]);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    const data = await fetchOrders(user.id);
    setOrders(Array.isArray(data) ? data : []);
  }, [user]);

  const loadClients = useCallback(async () => {
    if (!user) return;
    const data = await fetchClients(user.id);
    setClients(Array.isArray(data) ? data : []);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
    }
  }, [user, loadProducts, loadOrders, loadClients]);

  // ==========================
  // PRODUCTS
  // ==========================
  const toggleProduct = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addProduct = async () => {
    if (!name || !price || !stock) return;

    try {
      await apiCreateProduct({
        name,
        price: Number(price),
        stock: Number(stock),
      });

      await loadProducts();

      setName("");
      setPrice("");
      setStock("");
    } catch (err) {
      console.error(err);
      alert("Error al crear producto");
    }
  };

  // ==========================
  // ORDERS
  // ==========================
  const updateQuantity = (id, quantity) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Number(quantity) } : p
      )
    );
  };

  // 🔥 CREAR PEDIDO REAL + UI INSTANTÁNEA
  const createOrder = async () => {
  if (!clientName || selectedProducts.length === 0) return;

  try {
    const res = await apiCreateOrder({
      client_name: clientName,
      items: selectedProducts.map(p => ({
        id: p.id,
        price: Number(p.price),
        quantity: Number(p.quantity || 1)
      }))
    });

    // 🔥 SI backend falla, no rompe UI
    const total = Number(res?.total || 0);

    setOrders(prev => [
      {
        id: res.id,
        client: clientName,
        total,
        status: "pending"
      },
      ...prev
    ]);

    await loadProducts();

    setSelectedProducts([]);
    setClientName("");

  } catch (err) {
    console.error(err);
    alert("Error al crear pedido");
  }
};

  // 🔥 ENTREGAR PEDIDO + UPDATE INSTANTÁNEO
  const deliverOrder = async (id) => {
  try {
    await apiDeliverOrder(id);

    // 🔥 UPDATE INMEDIATO
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "delivered" } : o
      )
    );

    // 🔥 sincroniza stock y evita desfasajes
    await loadProducts();

  } catch (err) {
    console.error(err);
    alert("Error al entregar pedido");
  }
};

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <button onClick={logout}>Cerrar sesión</button>
      <h1>Sistema de Pedidos y Stock</h1>

      <Products
        products={products}
        selectedProducts={selectedProducts}
        toggleProduct={toggleProduct}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        stock={stock}
        setStock={setStock}
        addProduct={addProduct}
      />

      <Clients
        clients={clients}
        setClients={setClients}
        user={user}
      />

      <Orders
        orders={orders}
        clients={clients}
        selectedProducts={selectedProducts}
        updateQuantity={updateQuantity}
        clientName={clientName}
        setClientName={setClientName}
        createOrder={createOrder}
        deliverOrder={deliverOrder}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}

export default App;