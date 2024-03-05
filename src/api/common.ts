import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const seed = () => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return;
  }
  axiosInstance.post("/seed");
};
