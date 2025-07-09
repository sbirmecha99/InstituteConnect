# InstituteConnect

InstituteConnect is a role-based academic portal designed to streamline communication and coordination between students, faculty, and administrators within an educational institution. Built using **Golang (Fiber)** for the backend and **React with MUI** for the frontend, the platform enables:

* 📅 Booking and managing **student-faculty appointments**
* 🏫 Room allocation and **weekly timetable management**
* 📣 Broadcasting **notifications** to specific semesters and departments
* 🧑‍🏫 Dashboards tailored to user roles: SuperAdmin, Admin/HOD, Professor, and Student

---

## 🌐 Live Demo

> *coming soon*

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* Material UI (MUI v5)
* Day.js for time handling

**Backend:**

* Golang + Fiber
* JWT-based authentication
* PostgreSQL (ORM: GORM)
* REST API design

**Dev Tools:**

* VS Code, Postman, GitHub

---

## 🚀 Features

### 👤 Role-Based Access

* SuperAdmin: Can create rooms, assign rooms, and manage admins
* Admin (HOD): Can assign rooms and view student/faculty data
* Professor: View and respond to appointment requests, post notifications
* Student: Book appointments and view relevant announcements

### 📅 Appointment System

* Students can request appointments with faculty
* Professors accept/decline and assign time slots
* Old appointments are auto-deleted 2 days after their scheduled time

### 🏫 Room & Timetable Management

* Weekly calendar-style timetable showing courses, rooms, and professors
* Admins and SuperAdmins can allocate rooms to courses

### 🔔 Notification Broadcasting

* Professors and admins can send notifications to selected semesters/departments

### 📊 Dashboards

* Each role sees a different dashboard showing relevant metrics, appointments, and more

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/instituteconnect.git
cd instituteconnect
```

### 2. Backend Setup (Golang)

```bash
cd backend
cp .env.example .env
# Fill in DB credentials and JWT secret

# Run migrations & start server
go run main.go
```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

* `JWT_SECRET`
* `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`

---

## 🧪 Test Users (for demo)

```
Student: student@example.com / 123456
Professor: prof@example.com / 123456
Admin: admin@example.com / 123456
SuperAdmin: super@example.com / 123456
```

---

## 🧠 Future Enhancements
1. Complete responsiveness
2. Downloadable PDF/CSV of weekly timetable
3. Integrating attendance tracker with AI to notify student of number of classes to be attended to have x% attendance (x being 75 in case of most colleges)
