# Travel Heaven

A full-stack travel discovery and tour reservation management platform built with Node.js, Express.js, MongoDB, and Vanilla JavaScript.

---

## Live Demo & GitHub

- **Live Demo**: [travel-heaven.vercel.app](https://travel-heaven.vercel.app)
- **GitHub Repository**: [github.com/Sparsh88/Travel-Heaven](https://github.com/Sparsh88/Travel-Heaven)
- **Demo Credentials**:
  - **Admin**: `admin@travelheaven.com` | `admin123`
  - **Traveler**: `user@travelheaven.com` | `user1234`

---

## Overview

**Travel Heaven** is a full-stack web application designed to simplify how travelers explore destinations, customize tour packages, and track their trip lifecycle. It provides an intuitive client interface for discovering domestic and international travel destinations, estimating dynamic package costs based on traveler counts and optional guide services, and processing simulated payments.

In addition to traveler-facing features, the platform features a role-guarded administrative dashboard equipped with Chart.js analytics, booking lifecycle controls, inventory CRUD management (destinations and packages), user account moderation, and transaction audit logs.

The application is built using a clean client-server architecture with Vanilla JavaScript on the frontend—avoiding heavy frontend framework overhead—and Express.js with Mongoose ODM on the backend, fully configured for serverless deployment on Vercel.

---

## Problem Statement

- **Fragmented Travel Planning**: Travelers frequently have to switch between disparate tools to research destinations, estimate custom group costs, and check trip verification updates.
- **Manual Booking & Verification Overhead**: Tour operators face operational friction when tracking reservations, verifying traveler documentation, and updating trip statuses manually.
- **Lack of Integrated Analytics**: Small-to-medium travel agencies often lack unified dashboards to monitor booking volumes, revenue trends, and customer reviews in real time.
- **Complex Tech Overheads**: Many web applications introduce heavy frontend framework complexities for workflows that can be efficiently solved using clean, native web standards.

---

## Key Features

### Traveler Features
- **Destination Search & Filtering**: Search domestic and international destinations with real-time keyword search, budget ranges, and minimum rating filters.
- **Dynamic Tour Package Customization**: Configure travel dates, number of travelers, and optional dedicated tour guide add-ons with instant server-validated cost calculation.
- **Simulated Payment Gateway**: Multi-method checkout supporting Card, UPI, and NetBanking with deterministic test triggers for successful and declined transactions.
- **5-Stage Trip Milestone Tracker**: Visual lifecycle tracking (`Booking Confirmed` → `Documents Verified` → `Tickets Generated` → `Travel Started` → `Trip Completed`) displayed in the user dashboard.
- **Automated Rating & Review System**: Travelers can submit reviews and ratings; destination averages and review counts are recalculated automatically via MongoDB aggregation pipelines.
- **TravelBot Virtual Assistant**: Keyword-driven conversational assistant providing immediate guidance on destination recommendations, visa tips, and platform FAQs.

### Administrative Features
- **Visual Analytics Dashboard**: Interactive revenue trends, monthly financial breakdowns, and booking distribution charts powered by Chart.js.
- **Booking Lifecycle Management**: Approve, reject, cancel, or manually advance milestone stages for any traveler booking.
- **Inventory & Content CRUD**: Add, edit, or delete destinations and multi-day tour packages with day-by-day itineraries.
- **User Moderation & Cascading Purging**: Manage registered user accounts with cascading deletion of linked bookings, payments, and reviews.
- **Transaction Audit Logs**: Searchable records of all completed and failed transactions with payment gateway metadata.

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Structure, responsive styling, client-side state handling, and theme toggling |
| **Data Visualization** | Chart.js (CDN) | Renders interactive revenue and booking analytics charts in the admin portal |
| **Backend** | Node.js, Express.js | REST API server, authentication middleware, business logic, and routing |
| **Database** | MongoDB, Mongoose ODM | Document database and object data modeling with schema validation |
| **Authentication & Security** | JWT, bcryptjs, Helmet, CORS, Express-Rate-Limit | Token-based auth, password hashing, security headers, and endpoint rate limiting |
| **Deployment** | Vercel | Serverless hosting with API rewrites and static asset serving |

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (Browser)                              │
│       HTML5 / CSS3 / Vanilla JS (Main App, Dashboard, Admin Panel)      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST API (JSON + JWT Header/Cookie)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Express.js Server                              │
│   ├── Security Middlewares (Helmet, CORS, Rate Limiters)                │
│   ├── Auth Middlewares (JWT Verification, Role-Based Access Guards)     │
│   ├── REST Routers (Auth, Users, Destinations, Packages, Bookings, etc.)│
│   └── Controllers (Business Logic, Dynamic Pricing, Milestone Engine)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Mongoose ODM
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           MongoDB Database                              │
│       Collections: Users, Admins, Destinations, Packages,               │
│                    Bookings, Payments, Reviews, Contacts                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Application Flow

1. **Destination Discovery**: The traveler browses catalog destinations and filters by location type (Domestic/International), budget, or ratings.
2. **Package Selection & Customization**: The traveler selects a tour package, specifies travel date, traveler count, and optional guide preferences.
3. **Reservation Creation**: The frontend posts booking data to `/api/bookings`; the backend validates availability, computes total price, generates a unique booking ID (`TH-XXXXXX`), and saves the status as `Pending`.
4. **Checkout Simulation**: The user proceeds to the payment portal, selects payment mode (Card / UPI / NetBanking), and submits payment details.
5. **Transaction Validation**: The backend validates payment parameters, creates a Payment record (`TXN-XXXXXX`), marks the booking as `Paid` and `Confirmed`, and advances the milestone tracker.
6. **Milestone Progression & Tracking**: The traveler tracks trip progress through 5 visual stages in their personal dashboard, while administrators can advance or update milestone statuses from the admin panel.
7. **Post-Trip Review**: Completed travelers post ratings and feedback, triggering MongoDB aggregation hooks to update destination rating metrics.

---

## Project Structure

```text
Travel-Heaven/
├── api/
│   └── index.js                   # Vercel serverless entry point exporting Express app
├── client/                        # Frontend views, styles, and scripts
│   ├── css/
│   │   ├── admin.css              # Styles for admin portal
│   │   ├── dashboard.css          # Styles for user dashboard & milestone tracker
│   │   └── style.css              # Global styles, variables, components & dark theme
│   ├── js/
│   │   ├── admin.js               # Admin panel logic, Chart.js integrations & CRUD
│   │   └── main.js                # Core UI logic, TravelBot assistant, auth handlers
│   ├── admin.html                 # Role-guarded administrator portal
│   ├── dashboard.html             # User booking history and trip milestone tracker
│   ├── destination-details.html   # Destination details & package booking modal
│   ├── destinations.html          # Destination catalog with live filtering
│   ├── index.html                 # Landing page with hero, featured tours & chatbot
│   ├── packages.html              # Curated tour packages list
│   ├── payment.html               # Multi-method checkout gateway simulation
│   └── setup.html                 # Database connection diagnostics & seed utility
├── server/                        # Backend Express application
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection & cold-start handler
│   ├── controllers/               # Route controllers (admin, auth, booking, payment, etc.)
│   ├── middlewares/               # Auth protection, role authorization, rate limiters
│   ├── models/                    # Mongoose schemas (8 relational collections)
│   ├── routes/                    # Modular Express REST API routes
│   ├── utils/                     # Seeding utilities and dataset helper
│   └── server.js                  # Express app configuration & middleware pipeline
├── vercel.json                    # Serverless routing and rewrite rules
└── package.json                   # Root workspace scripts
```

---

## Getting Started

### Prerequisites
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

### Local Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sparsh88/Travel-Heaven.git
   cd Travel-Heaven
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Seed Sample Data**:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5000` in your web browser.

---

## Key API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new traveler account with bcrypt password hashing |
| `POST` | `/api/auth/login` | Public | Authenticate traveler and return JWT authentication token |
| `POST` | `/api/admin/login` | Public | Authenticate administrator and set secure admin cookie/token |
| `GET` | `/api/destinations` | Public | Retrieve destinations with keyword, category, and budget query filters |
| `POST` | `/api/bookings` | Private (User) | Create a new tour reservation with dynamic price calculation |
| `GET` | `/api/users/bookings` | Private (User) | Retrieve logged-in user booking history with populated package info |
| `POST` | `/api/payments/checkout` | Private (User) | Process simulated payment and transition booking to `Confirmed` |
| `GET` | `/api/admin/analytics` | Private (Admin) | Retrieve aggregate KPIs (total revenue, booking volume, monthly trends) |
| `PUT` | `/api/admin/bookings/:id/status` | Private (Admin) | Update booking status and advance tracking milestone stage |
| `POST` | `/api/reviews` | Private (User) | Submit destination review and trigger average rating recalculation |

---

## Author

**Sparsh Chauhan**
- **GitHub**: [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn**: [Sparsh Chauhan](https://linkedin.com/in/sparshchauhan08)
