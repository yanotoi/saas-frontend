import React from "react";

export default function Orders({
  orders = [],
  clients = [],
  selectedProducts = [],
  toggleProduct = () => {},
  updateQuantity = () => {},
  clientName = "",
  setClientName = () => {},
  createOrder = () => {},
  deliverOrder = () => {},
  filter = "",
  setFilter = () => {}
}) {
  const safeProducts = Array.isArray(selectedProducts) ? selectedProducts : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const total = safeProducts.reduce(
    (acc, p) => acc + (p.price || 0) * (p.quantity || 0),
    0
  );

  const filteredOrders = safeOrders.filter(o =>
    (o.client || "").toLowerCase().includes((filter || "").toLowerCase())
  );

  const handleUpdateQuantity = (id, value) => {
    if (typeof updateQuantity === "function") {
      const qty = parseInt(value, 10) || 0;
      updateQuantity(id, qty);
    }
  };

  const handleDeliverOrder = (id) => {
    if (typeof deliverOrder === "function") {
      deliverOrder(id);
    }
  };

  const handleCreateOrder = () => {
    if (typeof createOrder === "function") {
      createOrder();
    }
  };

  const handleSetClientName = (value) => {
    if (typeof setClientName === "function") {
      setClientName(value);
    }
  };

  const handleSetFilter = (value) => {
    if (typeof setFilter === "function") {
      setFilter(value);
    }
  };

  return (
    <div>
      <h2>🧾 Crear Pedido</h2>

      <input
        list="clients"
        value={clientName || ""}
        onChange={e => handleSetClientName(e.target.value)}
        placeholder="Cliente"
      />

      <datalist id="clients">
        {safeClients.map(c => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>

      {safeProducts.map(p => (
        <div key={p.id}>
          {p.name}
          <input
            type="number"
            value={p.quantity || 0}
            onChange={e => handleUpdateQuantity(p.id, e.target.value)}
            min={0}
          />
        </div>
      ))}

      <h3>Total: ${total}</h3>
      <button onClick={handleCreateOrder}>Crear Pedido</button>

      <hr />

      <h2>🚚 Pedidos</h2>

      <input
        placeholder="Buscar cliente..."
        value={filter || ""}
        onChange={e => handleSetFilter(e.target.value)}
      />

      <ul>
        {filteredOrders.map(o => (
          <li key={o.id}>
            {o.client} - ${o.total} -{" "}
            {o.status === "pending" ? "Pendiente" : "Entregado"}

            {o.status === "pending" && (
              <button onClick={() => handleDeliverOrder(o.id)}>
                Entregar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}