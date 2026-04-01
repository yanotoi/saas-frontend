export const API = "https://web-production-6e9f.up.railway.app";

// helper para headers con token
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

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
export const fetchProducts = (userId) =>
  fetch(`${API}/products?user_id=${userId}`, {
    headers: authHeader(),
  }).then(res => res.json());

export const fetchOrders = (userId) =>
  fetch(`${API}/orders?user_id=${userId}`, {
    headers: authHeader(),
  }).then(res => res.json());

export const fetchClients = (userId) =>
  fetch(`${API}/clients?user_id=${userId}`, {
    headers: authHeader(),
  }).then(res => res.json());

// ==========================
// POST / PUT / DELETE
// ==========================
export const createProduct = (data) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

export const createOrder = (data) =>
  fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

export const deliverOrder = (id) =>
  fetch(`${API}/orders/${id}/deliver`, {
    method: "PUT",
    headers: authHeader(),
  });