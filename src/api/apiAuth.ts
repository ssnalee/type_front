import router from "@/router";
import store from "@/store";
import { getItemWithExpireTime } from "@/utils/common";
import axios, { AxiosInstance } from "axios";


export const API: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Accept: "*/*",
  },
  timeout: 10000, //10초 
});
API.interceptors.request.use(async (config) => {
  const token = getItemWithExpireTime('userInfoObj')?.access_token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorPayload = {

      error: error.response || error,
      path: router.currentRoute.value.path,
    }
    store.dispatch("error/handleApiError", errorPayload);
    return Promise.reject(error);
  }
);
