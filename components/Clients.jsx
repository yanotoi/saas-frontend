import { useState } from "react";

const API = "https://web-production-6e9f.up.railway.app";

export default function Clients({ clients = [], setClients, user }) {
  const [newClient, setNewClient] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 🔐 HEADERS SEGUROS
  const getAuthHeaders = () => {
    if (!user?.token) return {};

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
  };

  // ==========================
  // ➕ AGREGAR CLIENTE
  // ==========================
  const addClient = async () => {
    if (!newClient.trim()) return alert("Ingresá un nombre");

    try {
      const res = await fetch(`${API}/clients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newClient, user_id: user?.id }),
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const created = await res.json();

      if (!created) return;

      setClients(prev => [...prev, created]);
      setNewClient("");
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente");
    }
  };

  // ==========================
  // ✏️ EDITAR
  // ==========================
  const editClient = (client) => {
    setEditingId(client.id);
    setEditingName(client.name);
  };

  const updateClient = async (id) => {
    if (!editingName.trim()) return alert("El nombre no puede estar vacío");

    try {
      const res = await fetch(`${API}/clients/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: editingName }),
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setClients(prev =>
        prev.map(c => (c.id === id ? { ...c, name: editingName } : c))
      );

      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar cliente");
    }
  };

  // ==========================
  // 🗑️ ELIMINAR
  // ==========================
  const deleteClient = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;

    try {
      const res = await fetch(`${API}/clients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente");
    }
  };

  return (
    <div>
      <h2>👤 Clientes</h2>

      {/* ➕ NUEVO CLIENTE */}
      <input
        placeholder="Nuevo cliente"
        value={newClient}
        onChange={(e) => setNewClient(e.target.value)}
      />
      <button onClick={addClient}>Agregar</button>

      {/* 📋 LISTA */}
      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {/* MODO NORMAL */}
            <span style={{ display: editingId === c.id ? "none" : "inline" }}>
              {c.name}{" "}
              <button onClick={() => editClient(c)}>Editar</button>
              <button onClick={() => deleteClient(c.id)}>Eliminar</button>
            </span>

            {/* MODO EDICIÓN */}
            {editingId === c.id && (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                />
                <button onClick={() => updateClient(c.id)}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}