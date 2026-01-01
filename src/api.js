import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

/* 🔐 Attach token automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000",
// });

// // temporary token (we'll replace this later)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
