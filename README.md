# Employee Attendance System

A full-stack web application for managing employee attendance, built with Node.js, Express, PostgreSQL, and a simple HTML frontend.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Role-based Access**: Support for employee and manager roles
- **Attendance Tracking**: Check-in/check-out functionality with automatic time calculation
- **Late Detection**: Automatic marking of late arrivals (after 9:15 AM)
- **Manager Dashboard**: Comprehensive dashboard showing attendance statistics and reports
- **Real-time Data**: Live updates of attendance records and weekly summaries

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Interactivity

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-attendance-system
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Set up the database**

   Create a PostgreSQL database and run the following SQL to create the required tables:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'employee',
     employee_id VARCHAR(100) UNIQUE NOT NULL,
     department VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE attendance (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     date DATE NOT NULL,
     check_in_time TIMESTAMP,
     check_out_time TIMESTAMP,
     total_hours DECIMAL(5,2),
     status VARCHAR(50)
   );
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

## Usage

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### Attendance
- `POST /api/attendance/checkin` - Check in for the day
- `POST /api/attendance/checkout` - Check out for the day

#### Dashboard (Manager only)
- `GET /api/dashboard/manager` - Get dashboard statistics
- `GET /api/attendance/today-status` - Get today's attendance records

### Frontend Access

Open `frontend/manager-dashboard.html` in a web browser to access the manager dashboard. You'll need to:

1. Register a manager account via the API
2. Login to get a JWT token
3. Paste the token in the frontend code (currently hardcoded for demo purposes)

## Project Structure

```
employee-attendance-system/
├── server/
│   ├── index.js              # Main server file
│   ├── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── attendance.js     # Attendance routes
│   ├── package.json          # Backend dependencies
│   └── package-lock.json
├── frontend/
│   └── manager-dashboard.html # Manager dashboard interface
└── README.md
```

## API Request Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "Engineering",
    "role": "employee"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Check-in
```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Future Enhancements

- [ ] Employee self-service portal
- [ ] Mobile app support
- [ ] Advanced reporting and analytics
- [ ] Email notifications for late arrivals
- [ ] Integration with calendar systems
- [ ] Multi-company support
- [ ] Time-off request management
