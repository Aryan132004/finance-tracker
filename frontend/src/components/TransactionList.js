import { formatCurrency, formatDate } from "../utils/helpers";

// Filter bar + transaction list in one component (keeps it simple)
function TransactionList({ transactions, onDelete, filters, onFilterChange, categories }) {
  return (
    <div className="transaction-list">
      <h2>Transactions</h2>

      {/* Filter Controls */}
      <div className="filters">
        <select name="type" value={filters.type} onChange={onFilterChange}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select name="category" value={filters.category} onChange={onFilterChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={onFilterChange}
          placeholder="Start date"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={onFilterChange}
          placeholder="End date"
        />
      </div>

      {/* Transaction Items */}
      {transactions.length === 0 ? (
        <p className="empty-msg">No transactions found.</p>
      ) : (
        <ul className="txn-items">
          {transactions.map((txn) => (
            <li key={txn._id} className={`txn-item ${txn.type}`}>
              <div className="txn-info">
                <span className="txn-category">{txn.category}</span>
                {txn.note && <span className="txn-note">{txn.note}</span>}
                <span className="txn-date">{formatDate(txn.date)}</span>
              </div>
              <div className="txn-right">
                <span className={`txn-amount ${txn.type}`}>
                  {txn.type === "income" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </span>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(txn._id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;
