# ✈️ Travel Heaven

> A modern **Full Stack Travel Booking Platform** built with the **MERN Stack**, allowing users to discover destinations, book travel packages, manage reservations, and track their trips through an intuitive dashboard.

Inspired by platforms like **Expedia**, **MakeMyTrip**, and **Booking.com**.

---

## 🌐 Live Demo

**Application**

👉 https://travel-heaven-server.vercel.app/

> **Deployment:** Hosted on **Vercel**

---

# 📖 Overview

Travel Heaven is a full-stack web application designed to simplify travel planning and booking. Users can browse destinations, search travel packages, make bookings, simulate secure payments, and monitor their travel progress. An admin panel enables efficient management of users, bookings, destinations, and analytics.

This project demonstrates practical implementation of:

* RESTful API development
* Authentication & Authorization
* CRUD Operations
* MongoDB Database Design
* Dashboard Development
* Role-Based Access Control (RBAC)

---

# ✨ Features

## 👤 User Features

* User Registration & Login
* JWT Authentication
* Password Recovery
* Browse Popular Destinations
* Search & Filter Travel Packages
* Destination Details
* Package Booking
* Payment Simulation
* Booking History
* Travel Progress Tracking
* Personal Dashboard

---

## 🛠️ Admin Features

* Secure Admin Login
* Manage Users
* Manage Bookings
* Package Monitoring
* Booking Status Updates
* Analytics Dashboard
* Trip Milestone Tracking

---

# 🛠 Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Chart.js

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

## Database

* MongoDB
* Mongoose ODM

## Tools

* Git & GitHub
* Postman
* Nodemon
* Vercel

---

# 🏗 System Architecture

```text
Client (HTML/CSS/JavaScript)
            │
            │ REST API
            ▼
      Express.js Server
            │
            ▼
        MongoDB Database
```

---

# 📁 Project Structure

```bash
Travel-Heaven
│
├── client
│   ├── css
│   ├── js
│   ├── index.html
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── packages.html
│   ├── destinations.html
│   └── ...
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🔑 Authentication

* JWT Token Authentication
* Password Hashing using bcrypt
* Protected Routes
* Role-Based Authorization
* Admin Access Control

---

# 📊 Database Collections

* Users
* Destinations
* Packages
* Bookings
* Payments
* Reviews

### Entity Relationship

```text
User
 ├── Bookings
 ├── Payments
 └── Reviews

Destination
 ├── Packages
 ├── Reviews
 └── Bookings

Package
 └── Bookings

Booking
 └── Payment
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Sparsh88/travel-heaven.git

cd travel-heaven
```

---

## Install Dependencies

```bash
cd server

npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string_here

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

NODE_ENV=development
```

---

## Seed Database

```bash
npm run seed
```

---

## Start Development Server

```bash
npm run dev
```

---

# 🔐 Default Admin Credentials

| Field    | Value                                                   |
| -------- | ------------------------------------------------------- |
| Username | your_admin_username                                     |
| Email    | [admin@yourdomain.com](mailto:admin@yourdomain.com)     |
| Password | your_admin_password                                     |

---

# 📡 REST API

## Authentication

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | `/api/auth/register`             |
| POST   | `/api/auth/login`                |
| GET    | `/api/auth/me`                   |
| GET    | `/api/auth/logout`               |
| POST   | `/api/auth/forgotpassword`       |
| POST   | `/api/auth/resetpassword/:token` |

---

## Destinations

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/api/destinations`     |
| GET    | `/api/destinations/:id` |

---

## Packages

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/packages`     |
| GET    | `/api/packages/:id` |

---

## Bookings

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | `/api/bookings`            |
| GET    | `/api/bookings/:id`        |
| PUT    | `/api/bookings/:id/cancel` |

---

## Payments

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/payments/checkout` |

---

## Admin

| Method | Endpoint                          |
| ------ | --------------------------------- |
| POST   | `/api/admin/login`                |
| GET    | `/api/admin/analytics`            |
| GET    | `/api/admin/bookings`             |
| PUT    | `/api/admin/bookings/:id/confirm` |
| PUT    | `/api/admin/bookings/:id/status`  |
| DELETE | `/api/admin/users/:id`            |

---

# 🧪 Test Payment

### Card Payment

Use a card number containing:

```text
0000
```

### UPI Payment

Use a UPI ID containing:

```text
fail
```

---

# 📈 Future Improvements

* Razorpay Integration
* Stripe Payment Gateway
* Google OAuth Login
* Email Verification
* Hotel Booking
* Flight Booking
* AI Travel Recommendations
* Real-Time Notifications
* Multi-language Support
* Mobile Application

---

# 📸 Screenshots

```text
screenshots/
├── home.png
├── destinations.png
├── package-details.png
├── dashboard.png
└── admin-dashboard.png
```

> Add screenshots of your application after deployment for a more attractive GitHub repository.

---

# 🎯 Learning Outcomes

Through this project, I gained hands-on experience with:

* Building RESTful APIs using Express.js
* Designing MongoDB schemas with Mongoose
* JWT Authentication & Authorization
* Role-Based Access Control
* CRUD Operations
* Full-Stack Application Architecture
* API Testing using Postman
* Deploying applications on Vercel

---

# 👨‍💻 Author

**Sparsh Chauhan**

B.Tech Computer Science Engineering
Full Stack Web Developer

**GitHub:** https://github.com/Sparsh88

**LinkedIn:** https://linkedin.com/in/sparshchauhan08

---

# ⭐ Show Your Support

If you found this project useful or learned something from it, consider giving the repository a **⭐ Star**.

It helps others discover the project and motivates future improvements.

---

<p align="center">
Made with ❤️ by <strong>Sparsh Chauhan</strong>
</p>
