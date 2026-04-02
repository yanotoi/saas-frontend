export const API = "https://web-production-6e9f.up.railway.app";

// helper para headers con token
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

// ==========================
// AUTH
// ==========================
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
  }).then(res => res.json());

// ==========================
// GET
// ==========================
export const fetchProducts = () =>
  fetch(`${API}/products`, {
    headers: authHeader(),
  }).then(res => res.json());

export const fetchOrders = ({ status, date }) => {
  const params = new URLSearchParams();

  if (status && status !== "all") params.append("status", status);
  if (date) params.append("date", date);

  return fetch(`${API}/orders?${params.toString()}`, {
    headers: authHeader(),
  }).then(res => res.json());
};

export const fetchClients = () =>
  fetch(`${API}/clients`, {
    headers: authHeader(),
  }).then(res => res.json());

export const fetchStats = () =>
  fetch(`${API}/orders/stats`, {
    headers: authHeader(),
  }).then(res => res.json());

// ==========================
// 🔥 NUEVO → CERRAR CAJA
// ==========================
export const closeCash = () =>
  fetch(`${API}/orders/close-cash`, {
    method: "POST",
    headers: authHeader(),
  }).then(res => res.json());

// ==========================
// POST / PUT
// ==========================
export const createProduct = (data) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const createOrder = (data) =>
  fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const deliverOrder = (id) =>
  fetch(`${API}/orders/${id}/deliver`, {
    method: "PUT",
    headers: authHeader(),
  }).then(res => res.json());