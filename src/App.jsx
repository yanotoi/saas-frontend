import { useEffect, useState, useCallback } from "react";
import Clients from "../components/Clients";
import Login from "../components/Login";
import Products from "../components/Products";
import Orders from "../components/Orders";
import { fetchProducts, fetchOrders, fetchClients } from "./api";

function App() {
  const [user, setUser] = useState(null);

  // Productos
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Pedidos
  const [orders, setOrders] = useState([]);
  const [clientName, setClientName] = useState("");
  const [filter, setFilter] = useState("");

  // Clientes
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
    fetchProducts(user.id).then((data) =>
      setProducts(Array.isArray(data) ? data.map(p => ({...p, price: parseFloat(p.price), stock: parseInt(p.stock)})) : [])
    );
  }, [user]);

  const loadOrders = useCallback(() => {
    if (!user) return;
    fetchOrders(user.id).then((data) => setOrders(Array.isArray(data) ? data : []));
  }, [user]);

  const loadClients = useCallback(() => {
    if (!user) return;
    fetchClients(user.id).then((data) => setClients(Array.isArray(data) ? data : []));
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
    }
  }, [user, loadProducts, loadOrders, loadClients]);

  // FUNCIONES PRODUCTS
  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, {...product, quantity: 1}]; // inicializamos quantity
    });
  };

  const addProduct = () => {
    if (!name || !price || !stock) return;
    const newProduct = {
      id: products.length + 1,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
    };
    setProducts((prev) => [...prev, newProduct]);
    setName("");
    setPrice("");
    setStock("");
  };

  // FUNCIONES ORDERS
  const updateQuantity = (id, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const createOrder = () => {
    if (!clientName || selectedProducts.length === 0) return;
    const total = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const newOrder = {
      id: orders.length + 1,
      client: clientName,
      products: [...selectedProducts],
      total,
      status: "pending",
    };
    setOrders((prev) => [...prev, newOrder]);
    setSelectedProducts([]);
    setClientName("");
  };

  const deliverOrder = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "delivered" } : o))
    );
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
        toggleProduct={toggleProduct}
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