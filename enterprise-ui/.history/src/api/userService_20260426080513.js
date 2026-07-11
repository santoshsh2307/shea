import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
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

export const createUser = (userData, photoFiles) => {
  const formData = new FormData();
  
  // Add all user data to form data
  Object.keys(userData).forEach(key => {
    if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });
  
  // Add photos if provided
  if (photoFiles && photoFiles.length) {
    photoFiles.forEach(file => {
      if (file) {
        formData.append('photos', file);
      }
    });
  }
  
  return api.post("/v1/users", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadUserPhotos = (id, photoFiles) => {
  const formData = new FormData();
  photoFiles.forEach(file => {
    if (file) {
      formData.append('photos', file);
    }
  });
  return api.post(`/v1/users/${id}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateUser = (id, userData) => {
  return api.put(`/v1/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return api.delete(`/v1/users/${id}`);
};

export default api;
