# Student Attendance Management System

A complete full-stack web application for managing student attendance with real-time notifications, reports, and analytics.

## 📋 Features

- ✅ **Student Management** - Add, edit, delete students with roll numbers and classes
- ✅ **Attendance Tracking** - Mark daily attendance (Present/Absent) with date selection
- ✅ **View Records** - View attendance by date with summary statistics
- ✅ **Reports & Analytics** - Generate attendance reports with percentage calculations
- ✅ **Search Functionality** - Search students by name or roll number
- ✅ **Toast Notifications** - Real-time success/error notifications
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **RESTful API** - Well-structured backend API

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide Icons
- Fetch API

### Backend
- PHP 7.4+
- PDO for database operations
- RESTful API architecture

### Database
- PostgreSQL 12+
- Optimized indexes
- Stored procedures and views

## 📁 Project Structure

```
student-attendance-system/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── models/
│   │   ├── Student.php
│   │   └── Attendance.php
│   ├── utils/
│   │   ├── Response.php
│   │   └── Validator.php
│   └── api/
│       ├── students.php
│       ├── attendance.php
│       └── reports.php
│
└── database/
    └── schema.sql
```

## 🚀 Installation Guide

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PHP** (v7.4 or higher) - [Download](https://www.php.net/downloads)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional) - [Download](https://git-scm.com/)

### Step 1: Database Setup

1. **Start PostgreSQL service:**
   ```bash
   # Windows (if using PostgreSQL installer)
   # Service starts automatically
   
   # Linux
   sudo systemctl start postgresql
   
   # macOS (using Homebrew)
   brew services start postgresql
   ```

2. **Create the database:**
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE attendance_system;
   
   # Exit psql
   \q
   ```

3. **Run the schema file:**
   ```bash
   psql -U postgres -d attendance_system -f database/schema.sql
   ```

4. **Verify the setup:**
   ```bash
   psql -U postgres -d attendance_system -c "\dt"
   ```
   You should see `students` and `attendance` tables.

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update database credentials:**
   
   Edit `config/database.php`:
   ```php
   private $host = 'localhost';
   private $db_name = 'attendance_system';
   private $username = 'postgres';     // Your PostgreSQL username
   private $password = 'your_password'; // Your PostgreSQL password
   ```

3. **Test PHP installation:**
   ```bash
   php -v
   ```

4. **Start PHP development server:**
   ```bash
   # From the backend directory
   php -S localhost:8000
   ```
   
   The backend API will be available at: `http://localhost:8000`

### Step 3: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Initialize React app (if not already done):**
   ```bash
   npx create-react-app .
   ```

3. **Install dependencies:**
   ```bash
   npm install lucide-react
   ```

4. **Configure Tailwind CSS:**
   
   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```
   
   Update `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
   
   Add to `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Copy the application code:**
   - Copy the React component from the artifacts to `src/App.jsx`

6. **Update API URL:**
   
   In the React app, update the API base URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

7. **Start the development server:**
   ```bash
   npm start
   ```
   
   The app will open at: `http://localhost:3000`

## 🎯 Usage Guide

### 1. Managing Students

- Click on **"Manage Students"** tab
- Click **"Add Student"** button
- Fill in:
  - Student Name
  - Roll Number (unique)
  - Class
- Click **"Add Student"** to save
- Use **Edit** (✏️) to modify student details
- Use **Delete** (🗑️) to remove a student

### 2. Marking Attendance

- Go to **"Mark Attendance"** tab
- Select the date using the date picker
- For each student, click:
  - **"Present"** button (Green) to mark present
  - **"Absent"** button (Red) to mark absent
- Toast notifications will confirm your action

### 3. Viewing Records

- Go to **"View Records"** tab
- Select a date to view attendance
- See summary cards showing:
  - Total Students
  - Present Count
  - Absent Count
- Each student shows their attendance status

### 4. Generating Reports

- Go to **"Reports"** tab
- Select a student from dropdown
- Choose date range (Start Date and End Date)
- Click **"Generate Report"**
- View statistics:
  - Total Days
  - Present Days
  - Absent Days
  - Attendance Percentage

### 5. Search Feature

- Use the search bar to find students by:
  - Name (e.g., "John")
  - Roll Number (e.g., "CS101")

## 🔧 API Endpoints

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students.php` | Get all students |
| GET | `/api/students.php?id={id}` | Get student by ID |
| GET | `/api/students.php?search={term}` | Search students |
| POST | `/api/students.php` | Create new student |
| PUT | `/api/students.php` | Update student |
| DELETE | `/api/students.php` | Delete student |

### Attendance API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance.php?date={YYYY-MM-DD}` | Get attendance by date |
| GET | `/api/attendance.php?student_id={id}&start_date={date}&end_date={date}` | Get student attendance range |
| GET | `/api/attendance.php?stats=true&student_id={id}` | Get attendance statistics |
| POST | `/api/attendance.php` | Mark attendance |

### Request/Response Examples

**Mark Attendance:**
```json
// Request
POST /api/attendance.php
{
  "student_id": 1,
  "date": "2024-12-26",
  "status": "present"
}

// Response
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

**Get Students:**
```json
// Response
{
  "success": true,
  "message": "Students retrieved",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "roll_number": "CS101",
      "class": "Computer Science A"
    }
  ]
}
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Database connection failed
```
**Solution:**
- Check if PostgreSQL is running
- Verify credentials in `config/database.php`
- Test connection: `psql -U postgres -d attendance_system`

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 8000
- Check Response::setCorsHeaders() is called in API files
- Verify API_BASE_URL in frontend matches backend URL

### PHP Server Not Starting
```
Failed to listen on localhost:8000
```
**Solution:**
- Port might be in use. Try a different port:
  ```bash
  php -S localhost:8001
  ```
- Update frontend API_BASE_URL accordingly

### React App Won't Start
```
npm ERR! code ELIFECYCLE
```
**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Sample Data Not Loading
**Solution:**
- Check if schema.sql ran successfully
- Manually insert test data:
  ```sql
  INSERT INTO students (name, roll_number, class) 
  VALUES ('Test Student', 'TEST001', 'Test Class');
  ```

## 📊 Database Schema Details

### Students Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| roll_number | VARCHAR(50) | UNIQUE, NOT NULL |
| class | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Attendance Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| student_id | INTEGER | FOREIGN KEY → students(id) |
| date | DATE | NOT NULL |
| status | VARCHAR(20) | CHECK (present/absent) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Unique Constraint:** (student_id, date) - Prevents duplicate attendance for same student on same day

## 🔒 Security Considerations

1. **Input Validation:** All inputs are validated on backend
2. **SQL Injection Prevention:** Using PDO prepared statements
3. **XSS Protection:** Data sanitization implemented
4. **CORS Configuration:** Configured for development (adjust for production)

## 🚀 Production Deployment

### Backend Deployment

1. **Update CORS settings** in `Response.php`:
   ```php
   header("Access-Control-Allow-Origin: https://yourdomain.com");
   ```

2. **Use environment variables** for database credentials
3. **Enable HTTPS** on your server
4. **Set up proper file permissions**

### Frontend Deployment

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Update API URL** to production backend
3. **Deploy to hosting** (Netlify, Vercel, etc.)

### Database

1. **Backup regularly:**
   ```bash
   pg_dump -U postgres attendance_system > backup.sql
   ```

2. **Remove sample data** in production
3. **Set up SSL** for database connections

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository or contact support.

---

**Happy Attendance Tracking! 🎓**