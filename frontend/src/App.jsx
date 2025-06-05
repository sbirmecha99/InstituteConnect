import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Your Login page component
import Dashboard from "./pages/Dashboard"; // Your Dashboard page component
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected role-based dashboards */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/professor"
        element={
          <ProtectedRoute>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hod"
        element={
          <ProtectedRoute>
            <HODDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/dean"
        element={
          <ProtectedRoute>
            <DeanDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
