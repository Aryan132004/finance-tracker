import { useState, useEffect } from "react";
import SummaryCards from "../components/SummaryCards";
import { CategoryPieChart, MonthlyBarChart } from "../components/Charts";
import TransactionList from "../components/TransactionList";
import { getSummary, getCategoryChart, getMonthlyChart, getTransactions, deleteTransaction, getCategories } from "../utils/api";

function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "" });

  // Load everything on mount
  useEffect(() => {
    loadAll();
  }, []);

  // Reload transactions when filters change
  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadAll = async () => {
    try {
      const [summaryRes, catChartRes, monthlyRes, catsRes] = await Promise.all([
        getSummary(),
        getCategoryChart(),
        getMonthlyChart(),
        getCategories(),
      ]);
      setSummary(summaryRes.data);
      setCategoryData(catChartRes.data);
      setMonthlyData(monthlyRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await getTransactions(filters);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      loadTransactions();
      // Refresh summary and charts too
      const [summaryRes, catChartRes, monthlyRes] = await Promise.all([
        getSummary(),
        getCategoryChart(),
        getMonthlyChart(),
      ]);
      setSummary(summaryRes.data);
      setCategoryData(catChartRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="page">
      <SummaryCards summary={summary} />
      <div className="charts-row">
        <CategoryPieChart data={categoryData} />
        <MonthlyBarChart data={monthlyData} />
      </div>
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />
    </div>
  );
}

export default Dashboard;
