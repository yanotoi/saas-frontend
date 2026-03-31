export const API = "https://saas-backend-production-5adc.up.railway.app";

export const loginUser = (email, password) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(res => res.json());

export const registerUser = (email, password) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(res => {
    if (!res.ok) throw new Error("Error registrando usuario");
    return res.json();
  });

export const fetchProducts = (userId) =>
  fetch(`${API}/products?user_id=${userId}`).then(res => res.json());

export const fetchOrders = (userId) =>
  fetch(`${API}/orders?user_id=${userId}`).then(res => res.json());

export const fetchClients = (userId) =>
  fetch(`${API}/clients?user_id=${userId}`).then(res => res.json());

export const createProduct = (data) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const createOrder = (data) =>
  fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deliverOrder = (id) =>
  fetch(`${API}/orders/${id}/deliver`, { method: "PUT" });