✈️ Travel Heaven

A Full Stack Travel Booking Platform built with the MERN ecosystem (Node.js, Express.js, MongoDB) and a responsive HTML/CSS/JavaScript frontend.

Travel Heaven is a modern travel booking portal that allows users to explore destinations, book travel packages, manage reservations, make payments, track trip progress, and interact with an administrator dashboard.

Inspired by platforms like Expedia, MakeMyTrip, and Booking.com.

🌟 Features
User Features
User Registration & Login
JWT Authentication
Password Recovery
Explore Travel Destinations
Search & Filter Packages
Detailed Destination Pages
Package Booking System
Secure Payment Simulation
Booking History
Travel Progress Tracking
User Dashboard
Admin Features
Admin Authentication
Booking Management
User Management
Analytics Dashboard
Package Monitoring
Booking Status Updates
Trip Milestone Tracking
🖥️ Demo
Frontend : http://localhost:5000
Backend  : http://localhost:5000/api
🏗️ System Architecture
┌──────────────┐
│   Frontend   │
│ HTML CSS JS  │
└──────┬───────┘
       │ REST APIs
       ▼
┌──────────────┐
│ Express.js   │
│ Backend API  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ MongoDB      │
│ Database     │
└──────────────┘
🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript (ES6)
Chart.js
Backend
Node.js
Express.js
JWT Authentication
bcrypt.js
Database
MongoDB
Mongoose ODM
Development Tools
Nodemon
Postman
Git & GitHub
📂 Complete Project Structure
Travel-Heaven/
│
├── client/
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   └── admin.js
│   │
│   ├── index.html
│   ├── about.html
│   ├── destinations.html
│   ├── destination-details.html
│   ├── packages.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── payment.html
│   ├── payment-confirmation.html
│   ├── dashboard.html
│   └── admin.html
│
├── server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── packageController.js
│   │   ├── destinationController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleProtect.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Package.js
│   │   ├── Destination.js
│   │   └── Payment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── packageRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── utils/
│   │   └── seedData.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
⚙️ Installation Guide
1. Clone Repository
git clone https://github.com/yourusername/travel-heaven.git

cd travel-heaven
2. Install Dependencies
cd server
npm install
3. Configure Environment Variables

Create a .env file inside the server folder.

PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/travel-heaven

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

NODE_ENV=development
4. Seed Database
npm run seed
5. Start Application

Development Mode

npm run dev

Production Mode

npm start
🔐 Default Admin Credentials
Username : admin

Email    : admin@travelheaven.com

Password : admin123
📡 API Endpoints
Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/logout
POST   /api/auth/forgotpassword
POST   /api/auth/resetpassword/:token
Users
PUT    /api/users/profile
PUT    /api/users/updatepassword
GET    /api/users/bookings
Destinations
GET    /api/destinations
GET    /api/destinations/:id
Packages
GET    /api/packages
GET    /api/packages/:id
Bookings
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
Payments
POST   /api/payments/checkout
Admin
POST   /api/admin/login
GET    /api/admin/analytics
GET    /api/admin/bookings
PUT    /api/admin/bookings/:id/confirm
PUT    /api/admin/bookings/:id/status
DELETE /api/admin/users/:id
📊 Database Design
Collections
Users
Destinations
Packages
Bookings
Payments
Reviews
Relationships
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
🧪 Testing
Failed Card Payment
Use card number containing 0000
Failed UPI Payment
Use UPI containing "fail"
🚀 Future Enhancements
Razorpay Integration
Stripe Integration
Google Authentication
Email Verification
Hotel Booking Module
Flight Booking Module
AI Travel Recommendations
Real-Time Notifications
Multi-Language Support
Mobile Application
📸 Screenshots

Add screenshots here:

screenshots/
├── home.png
├── destinations.png
├── package-details.png
├── dashboard.png
├── admin-dashboard.png
![Home Page](screenshots/home.png)

![Destinations](screenshots/destinations.png)

![Dashboard](screenshots/dashboard.png)
🤝 Contributing

Contributions are welcome.

Fork the repository
Create a feature branch
Commit your changes
Push the branch
Create a Pull Request
👨‍💻 Author

Sparsh Chauhan

B.Tech Computer Science Engineering

Full Stack Web Developer

GitHub: https://github.com/your-github-username

LinkedIn: https://linkedin.com/in/your-linkedin-profile

⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.