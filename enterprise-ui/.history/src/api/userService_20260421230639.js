import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== AUTH ENDPOINTS ==========

export const loginUser = (credentials) => {
  return api.post("/v1/auth/login", credentials);
};

// ========== USER ENDPOINTS ==========

export const getAllUsers = () => {
  return api.get("/v1/users");
};

export const getUserById = (id) => {
  return api.get(`/v1/users/${id}`);
};

export const getUserByUsername = (username) => {
  return api.get(`/v1/users/username/${username}`);
};

export const createUser = (userData) => {
  return api.post("/v1/users", userData);
};

export const updateUser = (id, userData) => {
  return api.put(`/v1/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return api.delete(`/v1/users/${id}`);
};

export default api;
