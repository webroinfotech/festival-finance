import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("ffm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setSessionExpiredHandler(handler) {
  client.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401 && localStorage.getItem("ffm_token")) {
        handler();
      }
      return Promise.reject(error);
    }
  );
}

export const authApi = {
  login: (username, password) =>
    client.post("/auth/login", { username, password }).then((r) => r.data),
};

export const summaryApi = {
  get: () => client.get("/summary").then((r) => r.data),
};

export const collectionsApi = {
  list: () => client.get("/collections").then((r) => r.data),
  create: (payload) => client.post("/collections", payload).then((r) => r.data),
  update: (id, payload) => client.put(`/collections/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/collections/${id}`).then((r) => r.data),
  pdfUrl: () => `${BASE_URL}/collections/pdf`,
};

export const expensesApi = {
  list: () => client.get("/expenses").then((r) => r.data),
  create: (payload) => client.post("/expenses", payload).then((r) => r.data),
  update: (id, payload) => client.put(`/expenses/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/expenses/${id}`).then((r) => r.data),
  pdfUrl: () => `${BASE_URL}/expenses/pdf`,
};

export const auditApi = {
  list: () => client.get("/audit").then((r) => r.data),
};

export default client;
