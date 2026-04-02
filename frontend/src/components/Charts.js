import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { getMonthName } from "../utils/helpers";

// Register only what we use (keeps bundle smaller)
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Pie chart: expense by category
function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return <p className="empty-msg">No expense data yet.</p>;

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: [
          "#ef4444", "#f97316", "#eab308", "#22c55e",
          "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
        ],
      },
    ],
  };

  return (
    <div className="chart-box">
      <h3>Expenses by Category</h3>
      <Pie data={chartData} options={{ plugins: { legend: { position: "bottom" } } }} />
    </div>
  );
}

// Bar chart: monthly income vs expense
function MonthlyBarChart({ data }) {
  if (!data || data.length === 0) return <p className="empty-msg">No monthly data yet.</p>;

  // Build a map: "Jan 2024" -> { income: X, expense: Y }
  const monthMap = {};
  data.forEach(({ _id, total }) => {
    const label = `${getMonthName(_id.month)} ${_id.year}`;
    if (!monthMap[label]) monthMap[label] = { income: 0, expense: 0 };
    monthMap[label][_id.type] = total;
  });

  const labels = Object.keys(monthMap);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map((l) => monthMap[l].income),
        backgroundColor: "#22c55e",
      },
      {
        label: "Expense",
        data: labels.map((l) => monthMap[l].expense),
        backgroundColor: "#ef4444",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="chart-box">
      <h3>Income vs Expense (Monthly)</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export { CategoryPieChart, MonthlyBarChart };
