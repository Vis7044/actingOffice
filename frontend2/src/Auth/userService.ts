
import type { ILogin } from "../types/authTypes";
import axiosInstance from "../utils/axiosInstance";


export const login = async (credentials: ILogin) => {
  const res = await axiosInstance.post('Auth/login', credentials);
  return res.data; // should return: { token: '...' }
};

export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axiosInstance.get('Auth/me');

  return res.data;
};
