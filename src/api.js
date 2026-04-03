export const API = "https://web-production-6e9f.up.railway.app";

// ==========================
// 🔐 AUTH HEADER
// ==========================
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

// ==========================
// 🔥 MANEJO GLOBAL DE RESPUESTA
// ==========================
const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }

  const data = await res.json();
  return data;
};

// ==========================
// AUTH
// ==========================
export const loginUser = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // 🔥 GUARDAR SESIÓN
  if (data?.token) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

export const registerUser = async (email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data?.token) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

// ==========================
// GET
// ==========================
export const fetchProducts = () =>
  fetch(`${API}/products`, {
    headers: authHeader(),
  }).then(handleResponse);

export const fetchOrders = ({ status, date }) => {
  const params = new URLSearchParams();

  if (status && status !== "all") params.append("status", status);
  if (date) params.append("date", date);

  return fetch(`${API}/orders?${params.toString()}`, {
    headers: authHeader(),
  }).then(handleResponse);
};

export const fetchClients = () =>
  fetch(`${API}/clients`, {
    headers: authHeader(),
  }).then(handleResponse);

export const fetchStats = () =>
  fetch(`${API}/orders/stats`, {
    headers: authHeader(),
  }).then(handleResponse);

// ==========================
// CAJA
// ==========================
export const closeCash = () =>
  fetch(`${API}/orders/close-cash`, {
    method: "POST",
    headers: authHeader(),
  }).then(handleResponse);

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
  }).then(handleResponse);

export const createOrder = (data) =>
  fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deliverOrder = (id) =>
  fetch(`${API}/orders/${id}/deliver`, {
    method: "PUT",
    headers: authHeader(),
  }).then(handleResponse);