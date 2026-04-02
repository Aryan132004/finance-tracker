import { useState, useEffect } from "react";
import { getCategories, createCategory } from "../utils/api";

function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0], // today's date
    note: "",
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [error, setError] = useState("");

  // Load categories when type changes
  useEffect(() => {
    loadCategories();
  }, [form.type]);

  const loadCategories = async () => {
    try {
      const res = await getCategories(form.type);
      setCategories(res.data);
      // Auto-select first category
      if (res.data.length > 0) {
        setForm((prev) => ({ ...prev, category: res.data[0].name }));
      }
    } catch {
      setError("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      setError("Please fill all required fields");
      return;
    }
    try {
      await onAdd(form);
      // Reset form but keep type and date
      setForm((prev) => ({ ...prev, amount: "", note: "" }));
    } catch {
      setError("Failed to add transaction");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createCategory({ name: newCategory.trim(), type: form.type });
      setNewCategory("");
      setShowAddCategory(false);
      loadCategories(); // refresh list
    } catch {
      setError("Category already exists or failed to create");
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-row">
        <label>Amount *</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="form-row">
        <label>Type *</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-row">
        <label>Category *</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-link"
          onClick={() => setShowAddCategory(!showAddCategory)}
        >
          + Add Category
        </button>
      </div>

      {showAddCategory && (
        <div className="form-row inline">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button type="button" className="btn-secondary" onClick={handleAddCategory}>
            Save
          </button>
        </div>
      )}

      <div className="form-row">
        <label>Date *</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Note (optional)</label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a note..."
        />
      </div>

      <button type="submit" className="btn-primary">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;
