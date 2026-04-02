import { formatCurrency } from "../utils/helpers";

// Shows 3 summary cards: Total Income, Total Expense, Net Balance
function SummaryCards({ summary }) {
  const { totalIncome = 0, totalExpense = 0, netBalance = 0 } = summary;

  return (
    <div className="summary-cards">
      <div className="card income-card">
        <p className="card-label">Total Income</p>
        <p className="card-amount">{formatCurrency(totalIncome)}</p>
      </div>
      <div className="card expense-card">
        <p className="card-label">Total Expenses</p>
        <p className="card-amount">{formatCurrency(totalExpense)}</p>
      </div>
      <div className={`card balance-card ${netBalance >= 0 ? "positive" : "negative"}`}>
        <p className="card-label">Net Balance</p>
        <p className="card-amount">{formatCurrency(netBalance)}</p>
      </div>
    </div>
  );
}

export default SummaryCards;
