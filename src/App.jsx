import { useEffect, useState, useCallback } from "react";
import Clients from "../components/Clients";
import Login from "../components/Login";
import Products from "../components/Products";
import Orders from "../components/Orders";
import {
  fetchProducts,
  fetchOrders,
  fetchClients,
  fetchStats,
  closeCash, // 👈 NUEVO
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

  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [stats, setStats] = useState({ total_sales: 0, total_orders: 0 });

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
  // 🔥 PRINT TICKET
  // ==========================
  const printTicket = (order, items) => {
    const win = window.open("", "PRINT", "height=600,width=400");

    win.document.write(`
      <html>
        <head>
          <title>Ticket</title>
          <style>
            body {
              font-family: monospace;
              padding: 10px;
            }
            h2 {
              text-align: center;
            }
            .line {
              display: flex;
              justify-content: space-between;
            }
            hr {
              border-top: 1px dashed black;
            }
          </style>
        </head>
        <body>
          <h2>🧾 Ticket</h2>
          <p>Cliente: ${order.client}</p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
          <hr/>
          ${items.map(p => `
            <div class="line">
              <span>${p.name} x${p.quantity}</span>
              <span>$${(p.price * p.quantity).toFixed(2)}</span>
            </div>
          `).join("")}
          <hr/>
          <h3>Total: $${order.total.toFixed(2)}</h3>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  // ==========================
  // LOADERS
  // ==========================
  const loadProducts = useCallback(async () => {
    if (!user) return;
    const data = await fetchProducts(user.id);
    setProducts(Array.isArray(data) ? data : []);
  }, [user]);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    const data = await fetchOrders({ status, date });
    setOrders(Array.isArray(data) ? data : []);
  }, [user, status, date]);

  const loadClients = useCallback(async () => {
    if (!user) return;
    const data = await fetchClients(user.id);
    setClients(Array.isArray(data) ? data : []);
  }, [user]);

  const loadStats = useCallback(async () => {
    if (!user) return;
    const data = await fetchStats();
    setStats(data);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadOrders();
      loadClients();
      loadStats();
    }
  }, [user, loadProducts, loadOrders, loadClients, loadStats]);

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

      const newOrder = {
        id: res.id,
        client: clientName,
        total: Number(res.total),
        status: "pending",
        products: selectedProducts
      };

      setOrders(prev => [newOrder, ...prev]);

      // 🔥 IMPRIME AUTOMÁTICO
      printTicket(newOrder, selectedProducts);

      await loadProducts();
      await loadStats();

      setSelectedProducts([]);
      setClientName("");

    } catch (err) {
      console.error(err);
      alert("Error al crear pedido");
    }
  };

  const deliverOrder = async (id) => {
    try {
      await apiDeliverOrder(id);

      setOrders(prev =>
        prev.map(o =>
          o.id === id ? { ...o, status: "delivered" } : o
        )
      );

      await loadProducts();
      await loadStats();

    } catch (err) {
      console.error(err);
      alert("Error al entregar pedido");
    }
  };

  const handleCloseCash = async () => {
  if (!confirm("¿Cerrar caja del día?")) return;

  try {
    await closeCash();
    alert("Caja cerrada correctamente");

    await loadStats();
  } catch (err) {
    console.error(err);
    alert("Error al cerrar caja");
  }
};

  if (!user) return <Login onLogin={setUser} />;

 return (
  <div className="pos-container">

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
      status={status}
      setStatus={setStatus}
      date={date}
      setDate={setDate}
      stats={stats}
      closeCash={handleCloseCash}
    />

  </div>
);
}

export default App;