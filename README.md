# Travel Heaven — Tour Discovery & Reservation Platform

A full-stack travel discovery and tour reservation management platform built with Node.js, Express.js, MongoDB, and Vanilla JavaScript with administrative analytics and dynamic package estimation.

---

## Live Demo & GitHub

- **Live Demo:** [https://travel-heaven.vercel.app](https://travel-heaven.vercel.app)
- **GitHub Repository:** [https://github.com/Sparsh88/Travel-Heaven](https://github.com/Sparsh88/Travel-Heaven)

---

## Overview

Travel Heaven is a full-stack web application designed to simplify how travelers explore destinations, customize tour packages, and track their trip lifecycle. It provides an intuitive client interface for discovering domestic and international travel destinations, estimating dynamic package costs based on traveler counts and optional guide services, and processing simulated payments.

In addition to traveler-facing features, the platform features a role-guarded administrative dashboard equipped with Chart.js analytics, booking lifecycle controls, inventory CRUD management (destinations and packages), user account moderation, and transaction audit logs.

The application is built using a clean client-server architecture with Vanilla JavaScript on the frontend—avoiding heavy frontend framework overhead—and Express.js with Mongoose ODM on the backend, fully configured for serverless deployment on Vercel.

---

## Problem Statement

- **Fragmented Travel Planning:** Travelers frequently switch across separate tools to research destinations, estimate custom group costs, and check trip verification updates.
- **Manual Booking & Verification Overhead:** Tour operators face operational friction when tracking reservations, verifying traveler documentation, and updating trip statuses manually.
- **Lack of Integrated Analytics:** Small-to-medium travel agencies often lack unified dashboards to monitor booking volumes, revenue trends, and customer reviews in real time.
- **Complex Tech Overheads:** Many web applications introduce heavy frontend framework complexities for workflows that can be efficiently solved using clean, native web standards.

---

## Key Features

- **Destination Search & Filtering:** Search domestic and international destinations with real-time keyword search, budget ranges, and minimum rating filters.
- **Dynamic Tour Package Customization:** Configure travel dates, number of travelers, and optional dedicated tour guide add-ons with instant server-validated cost calculation.
- **Simulated Payment Gateway:** Multi-method checkout supporting Card, UPI, and NetBanking with deterministic test triggers for successful and declined transactions.
- **5-Stage Trip Milestone Tracker:** Visual lifecycle tracking (`Booking Confirmed` → `Documents Verified` → `Tickets Generated` → `Travel Started` → `Trip Completed`) displayed in the user dashboard.
- **Automated Rating & Review System:** Travelers can submit reviews and ratings; destination averages and review counts are recalculated automatically via MongoDB aggregation pipelines.
- **TravelBot Virtual Assistant:** Keyword-driven conversational assistant providing immediate guidance on destination recommendations, visa tips, and platform FAQs.
- **Visual Analytics Dashboard:** Interactive revenue trends, monthly financial breakdowns, and booking distribution charts powered by Chart.js.
- **Booking Lifecycle Management:** Approve, reject, cancel, or manually advance milestone stages for any traveler booking.
- **Inventory & Content CRUD:** Add, edit, or delete destinations and multi-day tour packages with day-by-day itineraries.

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) | Structure, responsive styling, client-side state handling, and theme toggling |
| Data Visualization | Chart.js (CDN) | Renders interactive revenue and booking analytics charts in the admin portal |
| Backend Runtime | Node.js, Express.js | REST API server, authentication middleware, business logic, and routing |
| Database & ODM | MongoDB Atlas, Mongoose ODM | Document database and object data modeling for destinations, bookings, and users |
| Authentication | Session Cookies, bcryptjs | User password hashing and role-based session authorization (`traveler` / `admin`) |
| Deployment | Vercel | Serverless functions (`@vercel/node`) and static asset hosting |

---

## Architecture

```text
Client Browser (Vanilla JS + HTML5/CSS3 + Chart.js)
       │
       │ HTTPS / REST API
       ▼
Express.js Server (Node.js on Vercel Serverless)
  ├── Auth Middleware (Session/Role Verification)
  ├── Controllers (Auth, Destinations, Bookings, Reviews, Admin)
  └── Mongoose ODM (MongoDB Atlas Connection Pooling)
               │
               ▼
       MongoDB Database (Atlas)
```

---

## Application Flow

1. **Destination Discovery:** Traveler searches destinations by country, category, price range, and rating.
2. **Package Customization:** Traveler selects dates, guest count, and optional tour guide; total price calculates dynamically.
3. **Checkout & Payment:** Traveler completes simulated checkout via Card, UPI, or NetBanking.
4. **Milestone Tracking:** Traveler monitors 5-stage trip progression in their private dashboard.
5. **Review Submission:** Upon trip completion, traveler leaves star ratings and feedback; destination averages update automatically.
6. **Admin Oversight:** Admin logs into portal to review revenue charts, manage bookings, and update destination inventory.

---

## Project Structure

```text
Travel-Heaven/
├── public/                    # Frontend client assets
│   ├── css/                   # Stylesheets (main, admin, auth)
│   ├── js/                    # Client scripts (app.js, admin.js, auth.js)
│   ├── images/                # Destination and UI imagery
│   ├── index.html             # Main landing page
│   ├── destinations.html      # Catalog page
│   ├── booking.html           # Package customization & checkout
│   ├── dashboard.html         # Traveler dashboard & trip tracker
│   └── admin.html             # Administrative analytics portal
├── src/                       # Backend API source
│   ├── config/                # Database connection
│   ├── controllers/           # Auth, destination, booking, review, admin controllers
│   ├── middleware/            # Auth and admin protection middleware
│   ├── models/                # Mongoose models (User, Destination, Booking, Review)
│   ├── routes/                # Express REST routes
│   └── app.js                 # Express application configuration
├── server.js                  # Local development server entry
├── vercel.json                # Vercel serverless deployment routing
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: MongoDB Atlas connection URI or local instance

### Local Installation

```bash
git clone https://github.com/Sparsh88/Travel-Heaven.git
cd Travel-Heaven
npm install
```

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Author

**Sparsh Chauhan**  
*Computer Science & Engineering Student | Full Stack Developer*

- **Portfolio:** [portfolio-delta-topaz-jsfd5oekgj.vercel.app](https://portfolio-delta-topaz-jsfd5oekgj.vercel.app/)
- **GitHub:** [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn:** [linkedin.com/in/sparshchauhan08](https://linkedin.com/in/sparshchauhan08)
- **Email:** [sparshchauhan050@gmail.com](mailto:sparshchauhan050@gmail.com)
