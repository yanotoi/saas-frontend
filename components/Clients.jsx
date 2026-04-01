import { useState } from "react";

const API = "https://web-production-6e9f.up.railway.app";

export default function Clients({ clients, setClients, user, loadClients }) {
  const [newClient, setNewClient] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  });

  const addClient = async () => {
    if (!newClient) return alert("Ingresá un nombre");

    try {
      await fetch(`${API}/clients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newClient, user_id: user.id }),
      });

      setNewClient("");
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente");
    }
  };

  const editClient = (client) => {
    setEditingId(client.id);
    setEditingName(client.name);
  };

  const updateClient = async (id) => {
    if (!editingName) return alert("El nombre no puede estar vacío");

    try {
      await fetch(`${API}/clients/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: editingName }),
      });

      setEditingId(null);
      setEditingName("");
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar cliente");
    }
  };

  const deleteClient = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;

    try {
      await fetch(`${API}/clients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      loadClients();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente");
    }
  };

  const safeClients = Array.isArray(clients) ? clients : [];

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
        {safeClients.map((c) => (
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