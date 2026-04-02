const Category = require("../models/Category");

// Default categories to seed on first run
const DEFAULT_CATEGORIES = [
  // Income
  { name: "Salary", type: "income", isDefault: true },
  { name: "Freelance", type: "income", isDefault: true },
  { name: "Investment", type: "income", isDefault: true },
  { name: "Gift", type: "income", isDefault: true },
  { name: "Other Income", type: "income", isDefault: true },
  // Expense
  { name: "Food", type: "expense", isDefault: true },
  { name: "Rent", type: "expense", isDefault: true },
  { name: "Transport", type: "expense", isDefault: true },
  { name: "Utilities", type: "expense", isDefault: true },
  { name: "Entertainment", type: "expense", isDefault: true },
  { name: "Healthcare", type: "expense", isDefault: true },
  { name: "Shopping", type: "expense", isDefault: true },
  { name: "Education", type: "expense", isDefault: true },
  { name: "Other Expense", type: "expense", isDefault: true },
];

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    // Seed defaults if DB is empty
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
    }

    const { type } = req.query;
    const filter = type ? { type } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    // Check for duplicate
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim(), type });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id  (only user-created categories)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.isDefault) {
      return res.status(403).json({ message: "Cannot delete default categories" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
