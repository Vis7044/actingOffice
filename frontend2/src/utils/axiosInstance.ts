import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5288/api'
});

axiosInstance.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token attached:", config.headers.Authorization);
      }
    }
    return config; 
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
