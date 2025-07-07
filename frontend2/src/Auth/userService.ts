
import type { ILogin } from "../types/authTypes";
import axiosInstance from "../utils/axiosInstance";


export const login = async (credentials: ILogin) => {
  const res = await axiosInstance.post('Auth/login', credentials);
  return res.data; // should return: { token: '...' }
};

export const logout = () => {
  localStorage.removeItem("token");
  
  window.location.href = '/login'; // Adjust the path as necessary
}

export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found, user is not authenticated"); 
    throw new Error("No token found, user is not authenticated");
  }

  const res = await axiosInstance.get('Auth/me');
  
  return res.data;
};
