import axios from "axios";

export const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:5005";
export const API_URL = `${ROOT_URL}/api/v1`;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
