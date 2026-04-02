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
  setFilter = () => {},
  status = "all",
  setStatus = () => {},
  date = "",
  setDate = () => {},
  stats = { total_sales: 0, total_orders: 0 }
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

      {/* 💰 CAJA */}
      <div style={{ marginBottom: 20 }}>
        <h3>💰 Caja del día</h3>
        <div>
          Ventas: ${stats.total_sales} | Pedidos: {stats.total_orders}
        </div>
      </div>

      {/* 🔎 FILTROS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <button onClick={() => setStatus("all")}>Todos</button>
        <button onClick={() => setStatus("pending")}>Pendientes</button>
        <button onClick={() => setStatus("delivered")}>Entregados</button>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <input
        placeholder="Buscar cliente..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div style={{ display: "grid", gap: 15, marginTop: 15 }}>
        {filteredOrders.map(o => (
          <div
            key={o.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <h3>{o.client}</h3>

            <p>
              💰 ${Number(o.total).toFixed(2)} |{" "}
              {o.status === "pending" ? "🟡 Pendiente" : "🟢 Entregado"}
            </p>

            <div>
              {o.products?.map(p => (
                <div key={p.id}>
                  {p.name} x{p.quantity} (${p.price})
                </div>
              ))}
            </div>

            {o.status === "pending" && (
              <button onClick={() => deliverOrder(o.id)}>
                🚚 Entregar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}