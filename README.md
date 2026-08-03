# Personal Finance Management System

A full-stack expense and income tracker I built to manage my own finances — and to go deep on the MERN stack while I was at it. Started as a way to actually track where my money goes every month, and turned into a much bigger project once I kept adding things I wished it had.

## Live Demo

🔗 [Add your deployed link here]

## What it does

At its core, it's an income/expense tracker with authentication, but I didn't want to stop at basic CRUD. Here's what's actually in it:

- **Secure login/signup** with JWT-based auth, so your data is tied to your account only
- **Add and track income & expenses**, each with a category, amount, date, and even a custom emoji icon
- **Dashboard with visualizations** — pie charts, bar charts, and trend lines (built with Recharts) so you can actually see your spending patterns instead of just scrolling a list
- **Category breakdown** — see exactly how much you spent on Food, Rent, Transport, etc. in the last 30 days
- **Keyword-based auto-categorization** — type "fruits" or "uber" and it suggests the right category automatically, without needing to call any paid AI API
- **Spending forecasts** — this was the part I'm most proud of. I wrote a linear regression function from scratch (no ML library) that looks at your monthly totals and predicts what you'll likely spend next month, plus whether your spending is trending up or down
- **Search & filter** — find transactions by category or description instantly
- **Excel export** — download your full transaction history as a `.xlsx` file
- **Fully responsive** — works properly on mobile, tablet, and desktop, not just desktop-first

## Why I built the forecast feature the way I did

I initially explored a Python microservice (Flask + scikit-learn) for the spending forecast, but decided against introducing a second service and a separate language just to run a linear regression. Instead, I implemented the least-squares regression math directly in JavaScript inside my Node backend — it's the same underlying algorithm scikit-learn's `LinearRegression` uses, just written by hand rather than imported from a library. Given how few months of data any single user has, a straightforward trend line is genuinely the right level of model complexity here anyway; anything fancier would just overfit on so little data. Keeping it inside the existing Node backend also meant one less service to deploy and maintain.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, Axios, React Router
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT
**Other libraries:** Moment.js (dates), xlsx (Excel export), react-hot-toast (notifications), emoji-picker-react

## Project Structure

```
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/      # Route logic (auth, income, expense, dashboard)
│   ├── middleware/       # Auth protection, file upload handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── utils/            # Forecasting logic, keyword categorization
│   └── server.js
│
└── frontend/expense-tracker/
    ├── src/
    │   ├── components/    # Charts, cards, forms, layout, modals
    │   ├── pages/          # Auth pages, Dashboard, Income, Expense
    │   ├── context/        # User auth context
    │   ├── hooks/          # Custom auth hook
    │   └── utils/          # API paths, axios instance, helpers
```

## Running it locally

### Prerequisites
- Node.js
- A MongoDB Atlas account (or local MongoDB instance)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend/expense-tracker
npm install
npm run dev
```

The app should now be running on `http://localhost:5173`, connected to your backend on `http://localhost:8000`.

## A note on the codebase

This started from following along with a tutorial to learn the MERN stack fundamentals, and I built on top of it significantly from there — adding the forecasting feature, category breakdown, keyword categorization, search/filter, and a full color/UI pass, along with a good amount of debugging along the way (case-sensitivity import bugs, MongoDB Atlas connection issues, Recharts config, you name it). I wanted to be upfront about that rather than pretend it was 100% from-scratch, since I think the honest version of this story is a better one anyway.

## What I'd add next

- A fixed-category dropdown instead of free-text input, to keep category data fully consistent
- Per-category forecasting, not just total spend
- A "financial health score" combining savings rate and spending trend into one number

## Author

**Shaba Khan**
MCA, Jamia Millia Islamia