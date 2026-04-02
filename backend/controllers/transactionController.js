const Transaction = require("../models/Transaction");

// GET /api/transactions
// Supports filters: ?type=income&category=Food&startDate=2024-01-01&endDate=2024-12-31
const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Build filter object dynamically
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Sort latest first
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// POST /api/transactions
const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, note } = req.body;

    // Basic validation
    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "Amount, type, category, and date are required" });
    }

    const transaction = await Transaction.create({ amount, type, category, date, note });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/summary
// Returns total income, total expenses, net balance
const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Aggregate total income and expenses in one query
    const summary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Convert array result to a readable object
    const totals = { income: 0, expense: 0 };
    summary.forEach((item) => {
      totals[item._id] = item.total;
    });

    res.json({
      totalIncome: totals.income,
      totalExpense: totals.expense,
      netBalance: totals.income - totals.expense,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/chart/category
// Returns expense totals grouped by category (for pie chart)
const getCategoryChart = async (req, res, next) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(data.map((item) => ({ category: item._id, total: item.total })));
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/chart/monthly
// Returns monthly income vs expense (for bar/line chart)
const getMonthlyChart = async (req, res, next) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
  getCategoryChart,
  getMonthlyChart,
};
