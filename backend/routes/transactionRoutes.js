const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
  getCategoryChart,
  getMonthlyChart,
} = require("../controllers/transactionController");

// Chart routes must come before /:id to avoid conflicts
router.get("/summary", getSummary);
router.get("/chart/category", getCategoryChart);
router.get("/chart/monthly", getMonthlyChart);

// CRUD routes
router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
