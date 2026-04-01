export default function Products({
  products,
  selectedProducts,
  toggleProduct,
  name,
  setName,
  price,
  setPrice,
  stock,
  setStock,
  addProduct
}) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div>
      <h2>📦 Productos</h2>

      <input
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />
      <input
        value={price || ""}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
      />
      <input
        value={stock || ""}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
      />

      <button onClick={addProduct}>Agregar</button>

      <ul>
        {safeProducts.map((p) => (
          <li key={p.id}>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleProduct && toggleProduct(p)}
              />
              {p.name} - ${p.price} - Stock: {p.stock}
              {p.stock < 5 && (
                <span style={{ color: "red" }}> ⚠ Bajo stock</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}