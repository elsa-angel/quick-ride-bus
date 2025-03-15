import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 10000,
  withCredentials: true,
  headers: {},
});

export default axiosInstance;
