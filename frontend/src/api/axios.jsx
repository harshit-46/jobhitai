import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            return Promise.reject(err);
        }
        console.error(err);
        return Promise.reject(err);
    }
);

export default api;