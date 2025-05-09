import axios from 'axios';
import getCookie from './get-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.6:8000',
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      !window.location.href.endsWith('/sign-in') &&
      error.response.status === 401
    ) {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
