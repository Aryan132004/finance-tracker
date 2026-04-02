import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Helper to mark active link
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-brand">💰 FinanceTracker</div>
      <div className="nav-links">
        <Link to="/" className={isActive("/")}>Dashboard</Link>
        <Link to="/add" className={isActive("/add")}>+ Add Transaction</Link>
        <Link to="/categories" className={isActive("/categories")}>Categories</Link>
      </div>
    </nav>
  );
}

export default Navbar;
