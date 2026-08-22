# GLobeTrotter
Odoo × LDCE Hackathon 2026 — [GlobeTrotter]


# 🌍 GlobeTrotter

### Empowering Personalized Travel Planning

GlobeTrotter is a full-stack travel planning application designed to simplify multi-city trip planning.

Users can create personalized trips, add destinations, manage activities, estimate expenses, build itineraries, and visualize their journeys using a day-by-day calendar.

---

# 📌 Project Overview

Planning a multi-city trip can involve managing destinations, dates, activities, expenses, and schedules across multiple platforms.

GlobeTrotter brings these tasks together into one application.

The platform allows users to:

- Create customized trips
- Add multiple cities and destinations
- Assign travel dates
- Add activities
- Track activity costs
- Manage trip expenses
- View complete itineraries
- View trips on a calendar/timeline
- Manage personal travel plans
- Authenticate securely using JWT

---

# 🎯 Project Goals

The main goals of GlobeTrotter are:

- Simplify multi-city travel planning
- Provide an intuitive travel planning interface
- Store complex travel data using a relational database
- Provide secure user authentication
- Allow users to organize destinations and activities
- Help users track estimated travel expenses
- Visualize trips using itinerary and calendar views

---

# ✨ Features

## 🔐 Authentication

- User signup
- User login
- JWT-based authentication
- Protected API requests
- User-specific travel data
- Authentication validation

---

## 🏠 Dashboard

The dashboard acts as the central hub of the application.

Features include:

- Welcome section
- View created trips
- Trip summaries
- Destination count
- Trip dates
- Trip descriptions
- Quick actions
- Create new trip
- Open itinerary
- Open calendar
- Edit trip
- Delete trip

---

## ✈️ Create Trip

Users can create a personalized trip using:

- Trip name
- Start date
- End date
- Description

Example:

Trip Name:
European Summer Trip

Start Date:
05 Aug 2026

End Date:
11 Aug 2026

Description:
Exploring Europe with friends.

🗺️ Itinerary Builder

Users can construct a multi-city itinerary.

Features:

Add stops
Add cities
Assign stop dates
View existing stops
Manage destinations
Add activities to destinations
📍 Trip Stops

Each trip can contain multiple destinations.

A stop contains information such as:

City
Start date
End date
Trip association

Example:

Trip
 │
 ├── London
 │   └── 05 Aug → 07 Aug
 │
 ├── Paris
 │   └── 08 Aug → 09 Aug
 │
 └── Rome
     └── 10 Aug → 11 Aug
🎯 Activities

Activities can be associated with individual trip stops.

Activity information includes:

Activity name
Description
Activity date
Duration
Cost

Examples:

Eiffel Tower Visit
City Walking Tour
Museum Visit
Food Tour
Boat Ride
📋 Itinerary View

The itinerary view provides a complete overview of a trip.

It displays:

Trip name
Travel dates
Destination count
Activity count
Activity cost
Destination-wise itinerary
Activities
Activity duration
Activity cost

Users can navigate between:

Itinerary
    ↓
Activities
    ↓
Calendar
    ↓
Budget
📅 Trip Calendar

The calendar provides a day-by-day visualization of the trip.

It displays:

Trip dates
Day numbers
Destinations active on each day
Activities scheduled on each day
Free days

Example:

DAY 1
05 Aug 2026

📍 London
05 Aug → 07 Aug


DAY 2
06 Aug 2026

📍 London
05 Aug → 07 Aug

🎯 City Walking Tour


DAY 3
07 Aug 2026

📍 London
05 Aug → 07 Aug
💰 Budget & Cost Breakdown

The budget section helps users monitor estimated trip costs.

It supports:

Expense tracking
Activity costs
Budget information
Cost summaries
Expense categories

The application can be extended to support:

Transport costs
Hotel costs
Food costs
Activity costs
Daily spending
Total trip spending
Budget alerts
🌎 City Management

GlobeTrotter includes city-related backend functionality.

The project contains:

CityController.java
CityService.java
CityRepository.java
CityDataSeeder.java

The city system can be used for:

City search
Destination discovery
City information
Adding cities to trips
Initial city data population
🧱 Technology Stack
Frontend
React
Vite
React Router
JavaScript
CSS
REST API integration
Backend
Java
Spring Boot
Spring Web
Spring Data JPA
Spring Security
JWT
Hibernate
Database
MySQL / relational SQL database
JPA / Hibernate ORM
Development
Git
GitHub
npm
Maven
PowerShell
VS Code / IntelliJ IDEA
📋 Prerequisites

Before running GlobeTrotter, install the following software.

1. Java

Java 17 or newer is recommended.

Check your version:

java -version

Example:

java version "17.x.x"
2. Node.js

Install Node.js 18 or newer.

Check:

node -v

Also check npm:

npm -v
3. Maven

Check Maven:

mvn -version

Maven is required to build and run the Spring Boot backend.

4. Git

Check Git:

git --version

Git is required for cloning and updating the repository.

5. MySQL

Install MySQL Server.

Make sure the MySQL service is running before starting the backend.

Create a database:

CREATE DATABASE globetrotter;
📥 Clone the Repository

Clone the GitHub repository:

git clone https://github.com/YOUR-USERNAME/globetrotter.git

Move into the project:

cd globetrotter
🗂️ Project Structure
globetrotter/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── ActivityManager.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── CreateTrip.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditTrip.jsx
│   │   │   ├── ItineraryBuilder.jsx
│   │   │   ├── ItineraryView.jsx
│   │   │   ├── TripCalendar.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── globetrotter/
│       │           │
│       │           ├── config/
│       │           │   └── CityDataSeeder.java
│       │           │
│       │           ├── controller/
│       │           │   ├── ActivityController.java
│       │           │   ├── AuthController.java
│       │           │   ├── BudgetExpenseController.java
│       │           │   ├── CityController.java
│       │           │   ├── TestController.java
│       │           │   ├── TripController.java
│       │           │   ├── TripStopController.java
│       │           │   └── UserController.java
│       │           │
│       │           ├── model/
│       │           │
│       │           ├── repository/
│       │           │
│       │           └── service/
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
└── README.md
🗄️ Database Setup

GlobeTrotter uses a relational database.

Create the database:

CREATE DATABASE globetrotter;

Then configure the backend.

Open:

src/main/resources/application.properties

Example configuration:

spring.datasource.url=jdbc:mysql://localhost:3306/globetrotter
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

Replace:

YOUR_PASSWORD

with your local MySQL password.

⚙️ Backend Setup

The backend is a Spring Boot application.

From the root project directory:

cd globetrotter

Install/build dependencies:

mvn clean install

Then start the backend:

mvn spring-boot:run

The backend should start on:

http://localhost:8080

Keep this terminal running.

🖥️ Frontend Setup

Open a second terminal.

From the project root:

cd frontend

Install frontend dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend should normally run at:

http://localhost:5173

Open that URL in your browser.

▶️ Running the Full Application

You need two terminals.

Terminal 1 — Backend

From:

globetrotter/

run:

mvn spring-boot:run

Backend:

http://localhost:8080
Terminal 2 — Frontend

From:

globetrotter/frontend/

run:

npm run dev

Frontend:

http://localhost:5173
🔗 Frontend and Backend Communication

Frontend API calls are handled through:

frontend/src/services/api.js

The frontend communicates with the Spring Boot backend.

Typical backend URL:

http://localhost:8080

For example:

Frontend
   │
   │ HTTP Request
   ▼
Spring Boot API
   │
   ▼
Service Layer
   │
   ▼
Repository
   │
   ▼
MySQL Database
🔐 Authentication

GlobeTrotter uses JWT authentication.

The typical authentication flow is:

User
 ↓
Login
 ↓
Spring Boot Authentication
 ↓
JWT Token
 ↓
Frontend stores token
 ↓
Frontend sends token with API requests
 ↓
Spring Security validates token
 ↓
Protected API

Protected requests use:

Authorization: Bearer <JWT_TOKEN>
🛣️ Frontend Routes

The application currently contains the following routes:

/login

/signup

/dashboard

/create-trip

/edit-trip/:id

/trips/:id/itinerary

/trips/:id/activities

/trips/:id/itinerary-view

/trips/:id/budget

/trips/:id/calendar
🔌 Backend Controllers

The backend currently contains controllers for:

Authentication
Users
Trips
Trip Stops
Activities
Budget / Expenses
Cities

Main controller files:

AuthController.java
UserController.java
TripController.java
TripStopController.java
ActivityController.java
BudgetExpenseController.java
CityController.java
TestController.java
🧪 Testing the Application

After starting both servers:

Frontend:
http://localhost:5173

Backend:
http://localhost:8080

Follow this flow.

Step 1 — Signup

Open:

http://localhost:5173/signup

Create a new account.

Step 2 — Login

Open:

http://localhost:5173/login

Login with your account.

Step 3 — Dashboard

After login, open:

http://localhost:5173/dashboard
Step 4 — Create a Trip

Click:

Plan a Trip

Enter:

Trip name
Start date
End date
Description

Save the trip.

Step 5 — Add Destinations

Open the itinerary builder.

Add one or more cities/stops.

Example:

London
Paris
Rome
Step 6 — Add Activities

Open the activities section.

Add activities such as:

Museum Visit
City Tour
Food Tour
Boat Ride
Step 7 — View Itinerary

Open:

/trips/:id/itinerary-view

Review:

Destinations
Activities
Dates
Activity costs
Step 8 — View Calendar

Open:

/trips/:id/calendar

The calendar displays the trip day-by-day.

Step 9 — View Budget

Open:

/trips/:id/budget

Review trip expenses and estimated costs.

🐛 Debugging
Frontend Debugging

Open browser developer tools:

F12

Check:

Console
Network
Console

Look for:

JavaScript errors
React errors
Routing errors
Component errors
Network

Check API requests for:

401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
🔧 Backend Debugging

Check the terminal where Spring Boot is running.

Look for:

Exception
ERROR
SQL errors
JWT errors
403
401
500

If authentication fails, verify:

Backend is running
User exists
JWT is valid
Authorization header is being sent
Spring Security configuration is correct
Requested resource belongs to the logged-in user
🚨 Common Problems
Frontend doesn't start

Run:

cd frontend
npm install
npm run dev
Backend doesn't start

Run:

mvn clean install
mvn spring-boot:run

Check your Java and Maven versions.

Database connection error

Check:

MySQL is running
Database exists
Username is correct
Password is correct
Port is correct

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/globetrotter
401 Unauthorized

Possible causes:

JWT missing
JWT expired
Invalid token
User not authenticated
403 Forbidden

Possible causes:

Spring Security configuration
Invalid authorization
User does not own requested resource
Missing Authorization header
404 Not Found

Check:

Frontend route
Backend endpoint
API URL
Controller mapping
App.jsx
🌱 City Data Seeder

The backend includes:

CityDataSeeder.java

This component can populate initial city information into the database.

City functionality is handled by:

CityController.java
CityService.java
CityRepository.java
🗃️ Database Architecture

The application uses relational data relationships.

Simplified structure:

USER
 │
 ├── TRIPS
 │     │
 │     ├── TRIP STOPS
 │     │       │
 │     │       └── ACTIVITIES
 │     │
 │     └── EXPENSES
 │
 └── USER DATA

This structure allows users to maintain their own travel plans while keeping trips, destinations, activities, and expenses logically connected.

🔒 Security

Never commit sensitive credentials to GitHub.

Do NOT commit:

Database passwords
JWT secrets
API keys
Private credentials
.env files containing secrets

Use environment variables or local configuration files for sensitive information.

📦 Git Workflow

Check changes:

git status

Add files:

git add .

Commit:

git commit -m "Complete trip planning features"

Push:

git push origin main
🔄 Getting Latest Changes

If your teammate pushes new code:

git pull origin main

Then update frontend dependencies if necessary:

cd frontend
npm install

And restart the application.

👥 Sharing the Project With a Friend

Your friend can clone the repository:

git clone https://github.com/YOUR-USERNAME/globetrotter.git

Then:

cd globetrotter

Start the backend:

mvn spring-boot:run

Open another terminal:

cd frontend
npm install
npm run dev

Then open:

http://localhost:5173
🌐 Sharing the Website Online

The Vite development server:

http://localhost:5173

is normally accessible only from your own computer.

If you want a friend to access the frontend remotely, deploy the frontend using a hosting platform such as:

Vercel
Netlify
GitHub Pages

The backend also needs to be deployed to a publicly accessible server.

The frontend API configuration must then point to the deployed backend instead of:

http://localhost:8080
🤝 Team Development

Recommended workflow:

GitHub Repository
       │
       ├── Developer 1
       │
       └── Developer 2

Each developer should:

git pull origin main

Create a feature branch:

git checkout -b feature/my-feature

Make changes and test them.

Then:

git add .
git commit -m "Add my feature"
git push origin feature/my-feature

Create a Pull Request on GitHub.

📱 Responsive Design

The frontend is designed to work across:

Desktop
Laptop
Tablet
Mobile

Responsive styling is primarily handled through:

frontend/src/index.css
🚧 Future Improvements

Possible future features include:

🌎 Advanced destination discovery
🔎 City search and filters
🏨 Hotel recommendations
✈️ Flight information
🌤️ Weather integration
💱 Currency conversion
🗺️ Interactive maps
🤝 Collaborative trip planning
🔗 Public itinerary URLs
👥 Trip sharing
📱 Improved mobile experience
🔔 Trip reminders
📊 Advanced budget analytics
📈 Admin dashboard
❤️ Saved destinations
🖼️ Trip cover images
🌐 Public trip discovery
🏆 Hackathon Objective

GlobeTrotter demonstrates a complete full-stack travel planning workflow.

The project combines:

React
   +
Spring Boot
   +
Spring Security
   +
JWT
   +
JPA / Hibernate
   +
SQL Database
   +
REST APIs

to create a personalized travel planning platform.

🎯 User Journey

The intended user journey is:

SIGN UP
   ↓
LOGIN
   ↓
DASHBOARD
   ↓
CREATE TRIP
   ↓
ADD DESTINATIONS
   ↓
ADD ACTIVITIES
   ↓
BUILD ITINERARY
   ↓
VIEW ITINERARY
   ↓
VIEW CALENDAR
   ↓
CHECK BUDGET
   ↓
MANAGE TRIP
💡 Vision

GlobeTrotter aims to transform travel planning from a complicated process into an enjoyable and organized experience.

The long-term vision is to provide travelers with one platform where they can:

Dream
  ↓
Discover
  ↓
Plan
  ↓
Organize
  ↓
Budget
  ↓
Visualize
  ↓
Share
  ↓
Travel
❤️ Built With
React
Vite
Java
Spring Boot
Spring Security
JWT
JPA
Hibernate
MySQL
Git
GitHub
📄 License

This project was developed for educational and hackathon purposes.

A formal open-source license can be added if the project is released publicly.

👨‍💻 GlobeTrotter
Personalized Travel Planning Made Simple 🌍✈️
