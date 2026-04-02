# Finance Tracker

A full-stack Financial Tracking Application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Folder Structure

```
finance-tracker/
├── backend/
│   ├── controllers/
│   │   ├── transactionController.js   # All transaction logic
│   │   └── categoryController.js      # All category logic
│   ├── models/
│   │   ├── Transaction.js             # Transaction schema
│   │   └── Category.js                # Category schema
│   ├── routes/
│   │   ├── transactionRoutes.js       # /api/transactions routes
│   │   └── categoryRoutes.js          # /api/categories routes
│   ├── middleware/
│   │   └── errorHandler.js            # Global error handler
│   ├── server.js                      # App entry point
│   ├── .env.example                   # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js              # Top navigation bar
        │   ├── SummaryCards.js        # Income / Expense / Balance cards
        │   ├── TransactionForm.js     # Add transaction form
        │   ├── TransactionList.js     # List with filter controls
        │   └── Charts.js             # Pie chart + Bar chart
        ├── pages/
        │   ├── Dashboard.js           # Main overview page
        │   ├── AddTransaction.js      # Add transaction page
        │   └── Categories.js         # Manage categories page
        ├── utils/
        │   ├── api.js                 # All Axios API calls
        │   └── helpers.js            # formatCurrency, formatDate, etc.
        ├── App.js                     # Routes setup
        ├── App.css                    # All styles
        └── index.js                  # React entry point
```

---

## Tech Stack & Reasoning

| Layer    | Tech            | Why                                       |
| -------- | --------------- | ----------------------------------------- |
| Database | MongoDB         | Flexible schema, easy to iterate          |
| ORM      | Mongoose        | Schema validation + clean query API       |
| Backend  | Express + Node  | Minimal, fast, great for REST APIs        |
| Frontend | React 18        | Component-based, simple with hooks        |
| Routing  | React Router v6 | Simple client-side navigation             |
| HTTP     | Axios           | Cleaner than fetch, easy error handling   |
| Charts   | Chart.js        | Lightweight, easy to configure            |
| Styling  | Plain CSS       | No extra dependencies, easy to understand |

---

## Setup Steps

### Prerequisites

- Node.js v16+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repository

```bash
git clone <repo-url>
cd finance-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env and set your MONGO_URI if needed

npm run dev       # Development with nodemon
# or
npm start         # Production
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

The React app runs on **http://localhost:3000** and proxies API calls to **http://localhost:5001**.

---

## Database Schema

### `transactions` collection

```js
{
  amount:    Number,    // Required, must be > 0
  type:      String,    // "income" | "expense"
  category:  String,    // e.g. "Food", "Salary"
  date:      Date,      // Transaction date
  note:      String,    // Optional note
  createdAt: Date,      // Auto-added by Mongoose
  updatedAt: Date,      // Auto-added by Mongoose
}
```

### `categories` collection

```js
{
  name:      String,    // Unique category name
  type:      String,    // "income" | "expense"
  isDefault: Boolean,   // true = seeded default, false = user-created
}
```

> **Design decision**: Category name is stored as a plain string in transactions (not a reference ID). This avoids joins and keeps queries simple — appropriate for this scale.

---

## API Endpoints

### Transactions

| Method | Endpoint                             | Description                             |
| ------ | ------------------------------------ | --------------------------------------- |
| GET    | `/api/transactions`                | Get all transactions (supports filters) |
| POST   | `/api/transactions`                | Create a new transaction                |
| DELETE | `/api/transactions/:id`            | Delete a transaction                    |
| GET    | `/api/transactions/summary`        | Get total income, expense, balance      |
| GET    | `/api/transactions/chart/category` | Expense totals grouped by category      |
| GET    | `/api/transactions/chart/monthly`  | Monthly income vs expense data          |

**Query Parameters for GET `/api/transactions`:**

- `type` — `income` or `expense`
- `category` — e.g. `Food`
- `startDate` — e.g. `2024-01-01`
- `endDate` — e.g. `2024-12-31`

**Example Request (POST `/api/transactions`):**

```json
{
  "amount": 5001,
  "type": "income",
  "category": "Salary",
  "date": "2024-07-01",
  "note": "July salary"
}
```

---

### Categories

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| GET    | `/api/categories`     | Get all categories (optional `?type=`) |
| POST   | `/api/categories`     | Create a custom category                 |
| DELETE | `/api/categories/:id` | Delete a user-created category           |

**Example Request (POST `/api/categories`):**

```json
{
  "name": "Subscriptions",
  "type": "expense"
}
```

> Default categories are auto-seeded on first run. Default categories cannot be deleted.

---

## Features

- Add income and expense transactions
- View all transactions (latest first)
- Delete transactions
- Filter by type, category, and date range
- Dashboard with summary cards (total income, expenses, net balance)
- Category-wise expense pie chart
- Monthly income vs expense bar chart
- Predefined categories (auto-seeded)
- Add custom categories
- Responsive design (mobile-friendly)

---

## How It Works (Simple Flow)

```
User Action  →  React Component  →  Axios API Call
                                        ↓
                                  Express Route
                                        ↓
                                  Controller (business logic)
                                        ↓
                                  Mongoose Model (MongoDB)
                                        ↓
                                  JSON Response → UI Update
```

---

## Notes for Internship

- **No Redux** — state is kept local with `useState` and `useEffect`. Simple and sufficient.
- **No heavy validation libraries** — basic JS checks in controllers + Mongoose schema validation.
- **Error handling** — all errors flow through a single middleware (`errorHandler.js`), keeping controllers clean.
- **Aggregation** — used MongoDB `$group` aggregation for summary and chart data — more efficient than loading all records in JS.
- **Proxy** — React's `proxy` field in `package.json` forwards `/api` requests to Express in development. No CORS issues.
