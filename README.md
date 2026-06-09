# StyleCart - Bewakoof E-Commerce Clone

StyleCart is a premium streetwear fashion e-commerce platform built as a clone of Bewakoof. It features a modern, responsive React frontend styled with custom CSS properties (glassmorphic nav, animations, custom sliders) and a Node.js/Express backend.

## 🚀 Key Features
- **Clean Design System:** Curated warm yellow & charcoal theme matching current fashion storefront layouts.
- **Product Catalog Listing:** View categories (Men, Women, Accessories) with price filters, search query parsing, and sorting (Newest, Price Low-High, Rating).
- **Product Details & Sizing:** Interactive size selection and quantity increments.
- **Dynamic Cart Drawer:** Sliding sidebar cart with live subtotals, quantity adjustments, and deletion.
- **Simulated Checkout Flow:** Delivery form inputs, mock credit card processing, and order success status.
- **Client Auth Context:** Combined Sign Up & Login templates with token storage and validation rules.
- **Admin Dashboard:** Access controls for adding products, editing inventory, tracking orders, and viewing revenue stats.
- **Database Fallback Mode:** Connects to MongoDB out-of-the-box, but automatically falls back to a file-based storage database (`server/data/fallback_db.json`) if MongoDB is offline, allowing immediate testing.

---

## 📁 Project Structure
```text
stylecart/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProductCard, CartDrawer
│   │   ├── context/     # AuthContext, CartContext
│   │   ├── pages/       # Home, Listing, Details, Auth, Checkout, Orders, Admin
│   │   └── styles/      # components.css (custom styling)
│   └── index.html
├── server/              # Node.js + Express backend
│   ├── config/          # db.js connection helper
│   ├── controllers/     # Route business controllers
│   ├── models/          # Schemas & dbService wrapper
│   └── server.js        # Backend entry file
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Optional, local database. If not running, the application will automatically fall back to local file JSON database).

### 2. Seeding Data
Run the database seed script to populate products and the default admin user:
```bash
# From workspace root
node server/scripts/seed.js
```

### 3. Start the Backend
```bash
# Navigate to server folder and run dev server
cd server
npm run dev
```
The server will run on `http://localhost:5000`.

### 4. Start the Frontend
```bash
# Navigate to client folder and run dev server
cd client
npm run dev
```
The client will run on `http://localhost:5173`. Open this URL in your browser.

---

## 🧪 Testing Credentials
You can use the **Fast-fill** buttons on the Login page, or manually enter:

- **Admin Account:**
  - Email: `admin@stylecart.com`
  - Password: `admin123`
- **Customer Account:**
  - Create a new account using the **Sign Up** tab or the fast-fill helper.

---

## 🐙 Git & GitHub Integration
To push this codebase to the **Sayalii-Gaikwad** account:

1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete frontend and backend for StyleCart clone"
   ```
2. Link the repository to your GitHub remote:
   ```bash
   git remote add origin https://github.com/Sayalii-Gaikwad/stylecart.git
   ```
3. Push to main/master:
   ```bash
   git branch -M main
   git push -u origin main
   ```
