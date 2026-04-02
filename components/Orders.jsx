import React from "react";

export default function Orders({
  orders = [],
  clients = [],
  selectedProducts = [],
  updateQuantity = () => {},
  clientName = "",
  setClientName = () => {},
  createOrder = () => {},
  deliverOrder = () => {},
  filter = "",
  setFilter = () => {}
}) {
 const total = selectedProducts.reduce(
  (acc, p) => acc + Number(p.price || 0) * Number(p.quantity || 1),
  0
);

  const filteredOrders = orders.filter(o =>
    (o.client || "").toLowerCase().includes((filter || "").toLowerCase())
  );

  return (
    <div>
      <h2>🧾 Crear Pedido</h2>

      <input
        list="clients"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Cliente"
      />

      <datalist id="clients">
        {clients.map(c => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>

      {selectedProducts.map(p => (
        <div key={p.id}>
          {p.name}
          <input
            type="number"
            value={p.quantity}
            onChange={(e) =>
              updateQuantity(p.id, parseInt(e.target.value, 10) || 1)
            }
            min={1}
          />
        </div>
      ))}

      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={createOrder}>Crear Pedido</button>

      <hr />

      <h2>🚚 Pedidos</h2>

      <input
        placeholder="Buscar cliente..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul>
        {filteredOrders.map(o => (
          <li key={o.id}>
            {o.client} - ${Number(o.total).toFixed(2)} -{" "}
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