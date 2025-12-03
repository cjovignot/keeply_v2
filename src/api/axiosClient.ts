import axios from "axios";

const isProd = import.meta.env.PROD;

const axiosClient = axios.create({
  baseURL: isProd ? "/" : "http://localhost:3000/",
  withCredentials: true, // cookies
});

export default axiosClient;
