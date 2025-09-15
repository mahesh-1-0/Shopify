import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

export const fetchCustomers = async (apiKey) => {
  const res = await axios.get(`${API_BASE}/customers`, { params: { apiKey } });
  return res.data;
};

export const fetchProducts = async (apiKey) => {
  const res = await axios.get(`${API_BASE}/products`, { params: { apiKey } });
  return res.data;
};

export const fetchOrders = async (apiKey) => {
  const res = await axios.get(`${API_BASE}/orders`, { params: { apiKey } });
  return res.data;
};
