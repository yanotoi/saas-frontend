export default function Orders({ orders, clients, selectedProducts, toggleProduct, updateQuantity, clientName, setClientName, createOrder, deliverOrder, filter, setFilter }) {
  const total = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const filteredOrders = orders.filter(o => o.client.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>🧾 Crear Pedido</h2>
      <input list="clients" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Cliente" />
      <datalist id="clients">
        {clients.map(c => <option key={c.id} value={c.name} />)}
      </datalist>

      {selectedProducts.map(p => (
        <div key={p.id}>
          {p.name}
          <input type="number" value={p.quantity} onChange={e => updateQuantity(p.id, e.target.value)} />
        </div>
      ))}

      <h3>Total: ${total}</h3>
      <button onClick={createOrder}>Crear Pedido</button>

      <hr />
      <h2>🚚 Pedidos</h2>
      <input placeholder="Buscar cliente..." onChange={e => setFilter(e.target.value)} />

      <ul>
        {filteredOrders.map(o => (
          <li key={o.id}>
            {o.client} - ${o.total} - {o.status === "pending" ? "Pendiente" : "Entregado"}
            {o.status === "pending" && <button onClick={() => deliverOrder(o.id)}>Entregar</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}