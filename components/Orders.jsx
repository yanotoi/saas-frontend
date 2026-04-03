import React, { useMemo, useState, useEffect } from "react";

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
  stats = { total_sales: 0, total_orders: 0 },
  closeCash = () => {}
}) {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  // 🔥 detectar cliente nuevo
  useEffect(() => {
    if (!clientName) return;

    const exists = clients.some(
      c => c.name.toLowerCase() === clientName.toLowerCase()
    );

    if (!exists) {
      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2000);
    }
  }, [clientName, clients]);

  const total = selectedProducts.reduce(
    (acc, p) => acc + Number(p.price || 0) * Number(p.quantity || 1),
    0
  );

  // ⭐ calcular frecuencia de clientes
  const clientFrequency = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      map[o.client] = (map[o.client] || 0) + 1;
    });
    return map;
  }, [orders]);

  // 🔥 autocompletar inteligente
  const suggestions = useMemo(() => {
    if (!clientName) return [];

    return clients
      .filter(c =>
        c.name.toLowerCase().includes(clientName.toLowerCase())
      )
      .sort((a, b) => {
        const freqA = clientFrequency[a.name] || 0;
        const freqB = clientFrequency[b.name] || 0;
        return freqB - freqA;
      })
      .slice(0, 5);
  }, [clientName, clients, clientFrequency]);

  const filteredOrders = orders.filter(o =>
    (o.client || "").toLowerCase().includes((filter || "").toLowerCase())
  );

  return (
    <div className="pos-right">

      <div className="pos-cart">
        <h2>🧾 Pedido</h2>

        {/* INPUT CLIENTE */}
        <div style={{ position: "relative" }}>
          <input
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Cliente"
            className="pos-input"
          />

          {/* 🔥 SUGERENCIAS */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="pos-suggestions">
              {suggestions.map(c => (
                <div
                  key={c.id}
                  className="pos-suggestion-item"
                  onClick={() => {
                    setClientName(c.name);
                    setShowSuggestions(false);
                  }}
                >
                  {c.name}
                  {clientFrequency[c.name] > 2 && (
                    <span className="badge">⭐ Frecuente</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ✅ FEEDBACK CLIENTE NUEVO */}
          {justCreated && (
            <div className="pos-new-client">
              ✅ Cliente nuevo
            </div>
          )}
        </div>

        <div className="pos-items">
          {selectedProducts.map(p => (
            <div key={p.id} className="pos-item">
              <span>{p.name}</span>

              <input
                type="number"
                value={p.quantity}
                onChange={(e) =>
                  updateQuantity(p.id, parseInt(e.target.value, 10) || 1)
                }
              />
            </div>
          ))}
        </div>

        <h3 className="pos-total">Total: ${total.toFixed(2)}</h3>

        <button className="pos-pay" onClick={createOrder}>
          💳 COBRAR
        </button>
      </div>

      {/* CAJA ORIGINAL */}
      <div style={{ marginBottom: 20 }}>
        <h3>💰 Caja del día</h3>
        <div>
          Ventas: ${stats.total_sales} | Pedidos: {stats.total_orders}
        </div>

        <button
          onClick={closeCash}
          style={{
            marginTop: 10,
            background: "#111",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}
        >
          💰 Cerrar Caja
        </button>
      </div>

      <hr />

      <h2>🚚 Pedidos</h2>

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
          <div key={o.id} style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            background: "#fff"
          }}>
            <h3>
              {o.client}
              {(clientFrequency[o.client] || 0) > 2 && " ⭐"}
            </h3>

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