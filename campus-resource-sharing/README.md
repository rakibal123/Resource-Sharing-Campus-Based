# Campus Resource Sharing System

A platform for students and teachers to share and borrow resources within the campus.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT, BCrypt

## Project Structure

- `client`: Next.js frontend application
- `server`: Node.js/Express backend application

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Setup

1. **Clone the repository**
2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Configure Backend**
   - Create a `.env` file in `server` directory with:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```
4. **Run Backend**
   ```bash
   npm start
   # or
   node server.js
   ```

5. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```
6. **Run Frontend**
   ```bash
   npm run dev
   ```

## Features

- User Authentication (Login/Register)
- Role-based Access Control (Student, Teacher, Admin)
- Resource Management (Add, Edit, Delete)
- Borrowing System (Request, Approve, Return)
- Admin Dashboard
