import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Your Login page component
import Dashboard from "./pages/Dashboard"; // Your Dashboard page component
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ProfDashboard from "./pages/dashboards/ProfDashboard";
import DeanDashboard from "./pages/dashboards/DeanDashboard";
import HodDashboard from "./pages/dashboards/HodDashboard";



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
            <ProfDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hod"
        element={
          <ProtectedRoute>
            <HodDashboard />
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
