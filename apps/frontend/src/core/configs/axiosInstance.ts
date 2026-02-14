import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { authApiService, tokenService } from "../services";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = tokenService.getRefreshToken();

      if (!refresh) {
        tokenService.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const tokens = await authApiService.refreshToken(refresh);

        tokenService.setTokens(tokens.access_token, tokens.refresh_token);

        processQueue(null, tokens.access_token);

        originalRequest.headers!.Authorization = `Bearer ${tokens.access_token}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenService.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
