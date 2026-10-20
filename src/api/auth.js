import { api, TOKEN_KEY } from "./client";

export function hasToken() {
  try {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
}

export async function register(name, email, password) {
  await api.post("/register", { name, email, password });
}

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function fetchMe() {
  const { data } = await api.get("/me");
  return data;
}

export async function saveSetup(setup) {
  await api.post("/setup", setup);
}
