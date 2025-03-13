# ArtisanConnect-Backend

## About

**ArtisanConnect-Backend** is a backend API for managing artisan bookings. It provides secure authentication, real-time appointment scheduling, role-based access, and appointment status tracking. Built with **Node.js, Express, Knex.js, MySQL, and JWT authentication**, this backend ensures seamless interactions between users and artisans.

## Features

- User & Artisan Authentication (JWT-based)
- Appointment Booking with Timeframe Constraints
- Role-based Access Control
- Appointment Status Management (Pending, Accepted, Declined, Completed)
- Artisan Availability Tracking

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL with Knex.js ORM
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Express Validator

---

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Steps to Run Locally

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/ArtisanConnect-Backend.git
   cd ArtisanConnect-Backend
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Configure Environment Variables**
   - Create a `.env` file in the root directory and add:
     ```env
     PORT=8000
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     JWT_SECRET=your_secret_key
     ```
4. **Run Database Migrations**
   ```sh
   npx knex migrate:latest
   ```
5. **Start the Server**
   ```sh
   npm start
   ```
   The API will run on `http://localhost:5000`

---

## API Documentation

### Authentication

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "your_jwt_token"
  }
  ```

#### 2. Login

**Endpoint:** `POST /api/auth/login`

- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### Appointments

#### 3. Book an Artisan

**Endpoint:** `POST /api/appointments`

- **Headers:**
  ```json
  { "Authorization": "Bearer your_jwt_token" }
  ```
- **Request Body:**
  ```json
  {
    "artisan_id": 3,
    "service_id": 2,
    "start_time": "2025-03-05 10:00:00",
    "end_time": "2025-03-05 12:00:00"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Appointment booked successfully"
  }
  ```

#### 4. Artisan Accepts/Declines Appointment

**Endpoint:** `PATCH /api/appointments/:appointmentId`

- **Headers:**
  ```json
  { "Authorization": "Bearer artisan_jwt_token" }
  ```
- **Request Body:**
  ```json
  {
    "status": "accepted"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Appointment accepted"
  }
  ```

#### 5. Get Artisan’s Appointments

**Endpoint:** `GET /api/artisans/appointments`

- **Headers:**
  ```json
  { "Authorization": "Bearer artisan_jwt_token" }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_name": "John Doe",
      "service": "Plumbing",
      "start_time": "2025-03-05 10:00:00",
      "end_time": "2025-03-05 12:00:00",
      "status": "pending"
    }
  ]
  ```

---

## Contribution Guidelines

1. **Fork the Repository**
2. **Create a Feature Branch** (`git checkout -b feature-name`)
3. **Commit Changes** (`git commit -m "Add new feature"`)
4. **Push to GitHub** (`git push origin feature-name`)
5. **Open a Pull Request**

---

## License

This project is licensed under the **MIT License**.

