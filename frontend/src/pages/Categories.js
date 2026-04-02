import { useState, useEffect } from "react";
import { getCategories, createCategory, deleteCategory } from "../utils/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "expense" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      setError("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await createCategory(form);
      setForm({ name: "", type: "expense" });
      setSuccess("Category added!");
      setError("");
      loadCategories();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  // Separate income and expense for display
  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="page">
      <h2>Categories</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Add Category Form */}
      <form className="category-form" onSubmit={handleSubmit}>
        <h3>Add Custom Category</h3>
        <div className="form-row inline">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Category name"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button type="submit" className="btn-primary">Add</button>
        </div>
      </form>

      {/* Display Categories */}
      <div className="categories-grid">
        <div className="category-group">
          <h3 className="income-label">Income Categories</h3>
          <ul>
            {incomeCategories.map((cat) => (
              <li key={cat._id} className="category-item">
                <span>{cat.name}</span>
                {!cat.isDefault && (
                  <button className="btn-delete" onClick={() => handleDelete(cat._id)}>✕</button>
                )}
                {cat.isDefault && <span className="badge">default</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="category-group">
          <h3 className="expense-label">Expense Categories</h3>
          <ul>
            {expenseCategories.map((cat) => (
              <li key={cat._id} className="category-item">
                <span>{cat.name}</span>
                {!cat.isDefault && (
                  <button className="btn-delete" onClick={() => handleDelete(cat._id)}>✕</button>
                )}
                {cat.isDefault && <span className="badge">default</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Categories;
