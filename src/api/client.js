import axios from "axios";

export const TOKEN_KEY = "penny.token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Attach the saved token to every request.
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // Storage blocked: the request goes out without a token and the API answers 401.
  }
  return config;
});

// If the token is rejected, clear it and send the user to sign in again.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let hadToken = false;
    try {
      hadToken = Boolean(localStorage.getItem(TOKEN_KEY));
    } catch {
      hadToken = false;
    }
    if ((status === 401 || status === 403) && hadToken) {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // ignore
      }
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);
