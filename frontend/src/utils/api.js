import axios from "axios";

// Base URL for all API requests
// Points directly to backend to avoid proxy issues in development
const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// --- Transactions ---
export const getTransactions = (filters = {}) =>
  API.get("/transactions", { params: filters });

export const createTransaction = (data) =>
  API.post("/transactions", data);

export const deleteTransaction = (id) =>
  API.delete(`/transactions/${id}`);

export const getSummary = (filters = {}) =>
  API.get("/transactions/summary", { params: filters });

export const getCategoryChart = () =>
  API.get("/transactions/chart/category");

export const getMonthlyChart = () =>
  API.get("/transactions/chart/monthly");

// --- Categories ---
export const getCategories = (type = "") =>
  API.get("/categories", { params: type ? { type } : {} });

export const createCategory = (data) =>
  API.post("/categories", data);

export const deleteCategory = (id) =>
  API.delete(`/categories/${id}`);
