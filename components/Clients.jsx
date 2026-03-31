import { useState } from "react";

const API = "https://saas-backend-production-5adc.up.railway.app";

export default function Clients({ clients, setClients, user, loadClients }) {
  const [newClient, setNewClient] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const addClient = async () => {
    if (!newClient) return alert("Ingresá un nombre");
    await fetch(`${API}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClient, user_id: user.id }),
    });
    setNewClient("");
    loadClients();
  };

  const editClient = (client) => {
    setEditingId(client.id);
    setEditingName(client.name);
  };

  const updateClient = async (id) => {
    if (!editingName) return alert("El nombre no puede estar vacío");
    await fetch(`${API}/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    setEditingId(null);
    setEditingName("");
    loadClients();
  };

  const deleteClient = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    await fetch(`${API}/clients/${id}`, { method: "DELETE" });
    loadClients();
  };

  return (
    <div>
      <h2>👤 Clientes</h2>
      <input
        placeholder="Nuevo cliente"
        value={newClient}
        onChange={(e) => setNewClient(e.target.value)}
      />
      <button onClick={addClient}>Agregar</button>

      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => updateClient(c.id)}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {c.name}{" "}
                <button onClick={() => editClient(c)}>Editar</button>
                <button onClick={() => deleteClient(c.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}