# SmartAgri ⚡🌱

A full-stack smart agriculture electricity management portal for farmers and administrators.

---

## 📌 Overview

SmartAgri is a web-based platform designed to streamline electricity usage management in agriculture. It enables farmers to monitor power consumption, request additional units, and track transactions, while administrators can manage approvals, subsidies, and usage through a centralized dashboard.

---

## 🚀 Features

### 👨‍🌾 Farmer Module
- Secure registration and login
- Role-based protected routes
- Submit power requests (standard or paid top-up)
- Real-time cost estimation for paid requests
- Dashboard with:
  - Subsidy units
  - Paid units
  - Electricity usage
  - Transaction history

### 🛠 Admin Module
- Centralized dashboard for request management
- Approve / reject / delete requests
- Grant subsidy units to farmers
- Record electricity usage (meter updates)
- Automatic credit for approved paid top-ups
- Full transaction and ledger tracking

### 📊 Analytics & Insights
- Request trends visualization
- Status distribution charts
- Usage monitoring insights

### 🌦 Additional Features
- Weather advisory integration
- Government schemes information

---

## 🧱 Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express

### Database
- MongoDB with Mongoose

### Authentication & Security
- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control (RBAC)

### Tools & Libraries
- Axios
- Recharts
- Lucide Icons
- dotenv
- ESLint
- Nodemon

---

## 🏗 Architecture

Client (React + Vite) communicates with a REST API built using Express.  
MongoDB stores user data, transactions, and electricity usage records.  
JWT-based authentication secures API endpoints with role-based authorization.

---

## 🔑 Core Functional Flow

1. Farmer registers and logs in
2. Farmer submits electricity request
3. Admin reviews request
4. On approval:
   - Standard -> processed
   - Paid top-up -> units auto-credited
5. Transactions are recorded in ledger
6. Usage updates deduct units accordingly

---

## 📂 Project Structure

```text
PDA Test/
├── frontend/       # Frontend (React + Vite)
├── backend/        # Backend (Node.js + Express)
└── readme.md
```

---

## ⚙️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/smartagri.git
cd smartagri
```

2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Environment variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Run the application

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## 🔐 API Security

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes via middleware
- Role-based access for Admin and Farmer

---

## 📈 Future Improvements

- Mobile app version
- IoT integration for real-time meter data
- Payment gateway integration
- SMS/WhatsApp notifications
- Advanced analytics and predictions

---

## 🎯 Impact

- Improves transparency in electricity distribution
- Reduces manual workload for administrators
- Enables farmers to make informed energy decisions
- Supports efficient and sustainable agricultural practices