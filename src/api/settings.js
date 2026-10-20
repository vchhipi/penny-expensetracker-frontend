import { api } from "./client";

export const fetchSettings = async () => (await api.get("/settings")).data;
export const saveSettings = (payload) => api.put("/settings", payload);

export const fetchSubscriptions = async () => (await api.get("/subscriptions")).data;
export const addSubscription = (payload) => api.post("/subscriptions", payload);
export const updateSubscription = (id, payload) => api.put(`/subscriptions/${id}`, payload);
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);

export const saveProfile = (name) => api.put("/me/profile", { name });
export const savePassword = (currentPassword, newPassword) =>
  api.put("/me/password", { currentPassword, newPassword });