import axios from "axios";
import { clearAuthSession } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    Accept: "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("college_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // Don't set JSON content type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url || "";

    /* 401 = unauthorized */
    if (
      status === 401 &&
      !requestUrl.includes(
        "/auth/login"
      )
    ) {
      clearAuthSession();

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.assign(
          "/login"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;