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
    <div>
      <h2>📦 Productos</h2>

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