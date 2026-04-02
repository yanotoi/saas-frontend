import React from "react";

export default function Products({
  products = [],
  selectedProducts = [],
  toggleProduct = () => {},
  name = "",
  setName = () => {},
  price = "",
  setPrice = () => {},
  stock = "",
  setStock = () => {},
  addProduct = () => {}
}) {
  return (
    <div className="pos-left">

      <h2>📦 Productos</h2>

      {/* FORM ORIGINAL */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
      />
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
      />

      <button onClick={addProduct}>Agregar</button>

      {/* 🔥 GRID POS */}
      <div className="pos-grid">
        {products.map((p) => {
          const selected = selectedProducts.some(sp => sp.id === p.id);

          return (
            <button
              key={p.id}
              className={`pos-product ${selected ? "active" : ""}`}
              onClick={() => toggleProduct(p)}
            >
              <div>{p.name}</div>
              <div>${p.price}</div>
              <small>Stock: {p.stock}</small>
            </button>
          );
        })}
      </div>

      {/* LISTA ORIGINAL (NO LA BORRO) */}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedProducts.some(sp => sp.id === p.id)}
                onChange={() => toggleProduct(p)}
              />
              {p.name} - ${p.price} - Stock: {p.stock}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}