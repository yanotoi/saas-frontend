import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [clientName, setClientName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ======================
  // CARGAR DATOS
  // ======================

  const loadProducts = () => {
    fetch("https://saas-backend-production-5adc.up.railway.app/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const loadOrders = () => {
    fetch("https://saas-backend-production-5adc.up.railway.app/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ======================
  // PRODUCTOS
  // ======================

  const addProduct = async () => {
    if (!name || !price || !stock) {
      alert("Completá todos los campos");
      return;
    }

    await fetch("https://saas-backend-production-5adc.up.railway.app/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, stock }),
    });

    setName("");
    setPrice("");
    setStock("");

    loadProducts();
  };

  // ======================
  // PEDIDOS
  // ======================

  const toggleProduct = (product) => {
    const exists = selectedProducts.find(p => p.id === product.id);

    if (exists) {
      setSelectedProducts(
        selectedProducts.filter(p => p.id !== product.id)
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1 }
      ]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setSelectedProducts(
      selectedProducts.map(p =>
        p.id === id ? { ...p, quantity: Number(quantity) } : p
      )
    );
  };

  const total = selectedProducts.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  const createOrder = async () => {
    if (!clientName) {
      alert("Ingresá el cliente");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Seleccioná al menos un producto");
      return;
    }

    await fetch("https://saas-backend-production-5adc.up.railway.app/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: clientName,
        items: selectedProducts,
      }),
    });

    setClientName("");
    setSelectedProducts([]);

    loadOrders();
  };

  const deliverOrder = async (id) => {
    await fetch(`https://saas-backend-production-5adc.up.railway.app/orders/${id}/deliver`, {
      method: "PUT",
    });

    loadOrders();
    loadProducts();
  };

  // ======================
  // UI
  // ======================

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>Sistema de Pedidos y Stock</h1>
      <p>Controlá tus pedidos, stock y entregas en un solo lugar</p>

      {/* ====================== */}
      {/* PRODUCTOS */}
      {/* ====================== */}

      <hr />
      <h2>📦 Productos</h2>

      <input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Precio"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <input
        placeholder="Stock"
        value={stock}
        onChange={e => setStock(e.target.value)}
      />

      <button onClick={addProduct}>Agregar</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleProduct(p)}
              />
              {p.name} - ${p.price} - Stock: {p.stock}
            </label>
          </li>
        ))}
      </ul>

      {/* ====================== */}
      {/* CREAR PEDIDO */}
      {/* ====================== */}

      <hr />
      <h2>🧾 Crear Pedido</h2>

      <input
        placeholder="Cliente"
        value={clientName}
        onChange={e => setClientName(e.target.value)}
      />

      {selectedProducts.length > 0 && (
        <>
          <h4>Productos seleccionados:</h4>

          {selectedProducts.map(p => (
            <div key={p.id}>
              {p.name} - $
              <input
                type="number"
                value={p.quantity}
                min="1"
                onChange={e => updateQuantity(p.id, e.target.value)}
              />
            </div>
          ))}

          <h3>Total: ${total}</h3>
        </>
      )}

      <button onClick={createOrder}>Crear Pedido</button>

      {/* ====================== */}
      {/* PEDIDOS */}
      {/* ====================== */}

      <hr />
      <h2>🚚 Pedidos</h2>

      <ul>
        {orders.map(o => (
          <li key={o.id}>
            {o.client} - ${o.total} -{" "}
            {o.status === "pending" ? "Pendiente" : "Entregado"}

            {o.status === "pending" && (
              <button onClick={() => deliverOrder(o.id)}>
                Entregar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;