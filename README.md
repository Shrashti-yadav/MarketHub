# 🛒 MarketHub

A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Shop smarter with AI-powered product search, secure payments, and a seamless shopping experience.

🌐 **Live Demo:** [market-hub-zeta-plum.vercel.app](https://market-hub-zeta-plum.vercel.app)

---

## ✨ Features

### 🧑‍💻 User Panel
- 🔐 **Authentication** — Register, login, forgot/reset password with JWT & HTTP-only cookies
- 🛍️ **Product Browsing** — Filter by category, price, rating, and availability with pagination
- 🤖 **AI Search** — Natural language product search powered by Google Gemini
- ❤️ **Wishlist** — Save and manage favorite products
- 🛒 **Cart** — Add, remove, and update quantities with persistent state
- 💳 **Payments** — Stripe card payments and Cash on Delivery
- 📦 **Orders** — Place, track, and cancel orders
- ⭐ **Reviews** — Post and delete product reviews (verified buyers only)
- 👤 **Profile** — Update name, email, avatar, and password
- 🌙 **Dark/Light Mode** — Theme toggle with glassmorphism UI
- 📱 **Responsive** — Works on all screen sizes

### 🛡️ Admin Panel
- 📊 **Dashboard** — Revenue stats, monthly sales chart, order status breakdown, top selling products and low stock alerts
- 📦 **Orders** — View, update status, and delete orders
- 🛍️ **Products** — Add, view, update, and delete products
- 👥 **Users** — View and delete registered users
- 👤 **Profile** — Admin profile and password management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Stripe.js, Lucide React |
| **Admin** | React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express, PostgreSQL, JWT, Bcrypt |
| **Services** | Cloudinary (images), Stripe (payments), Nodemailer (emails), Google Gemini (AI search) |

---

## 📁 Project Structure

```
MarketHub/
├── admin/        # React admin panel
├── client/       # React user frontend
└── server/       # Express backend
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Cloudinary account
- Stripe account
- Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/Shrashti-yadav/MarketHub.git
cd MarketHub
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create `server/config/config.env`:

```env
PORT=4000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30

DB_USER=postgres
DB_HOST=localhost
DB_NAME=MarketHub
DB_PASSWORD=your_db_password
DB_PORT=5432

CLOUDINARY_CLIENT_NAME=your_cloud_name
CLOUDINARY_CLIENT_API=your_api_key
CLOUDINARY_CLIENT_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_FRONTEND_KEY=pk_test_...

SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

GEMINI_API_KEY=your_gemini_key
```

```bash
npm start
```

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

### 4. Setup the Admin Panel

```bash
cd admin
npm install
```

Create `admin/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

```bash
npm run dev
```

### 5. Stripe Webhook (local testing)

```bash
stripe listen --forward-to localhost:4000/api/v1/payment/webhook
```

Copy the webhook signing secret and update `STRIPE_WEBHOOK_SECRET` in `config.env`.

---

<p align="center">Built with ❤️ </p>
