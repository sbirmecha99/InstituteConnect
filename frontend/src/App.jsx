import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login"; // Your Login page component
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import EditProfile from "./pages/dashboards/features/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ProfDashboard from "./pages/dashboards/ProfDashboard";
import DeanDashboard from "./pages/dashboards/DeanDashboard";
import HodDashboard from "./pages/dashboards/HodDashboard";
import BookApp from "./pages/dashboards/features/BookApp";
import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import axios from "axios";
import ProfileView from "./pages/dashboards/features/ProfileView";
import ProfAppointments from "./pages/dashboards/features/ProfAppointments";
import TodoList from "./components/TodoList";
import StudentTimetable from "./components/StudentTimetable"
import Calendar from "./components/Calendar";
import RoomAllocation from "./pages/dashboards/features/RoomAllocation";

// Wrapper for themed dashboard routes
const ThemedDashboardRoutes = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Box display="flex" height="100vh">
              <Sidebar />
              <Box flex={1}>
                <Topbar />
                <Box p={2}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const App = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/me", {
          withCredentials: true, // IMPORTANT for sending cookies
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Not logged in or token invalid", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    if (!localStorage.getItem("user")) {
      fetchUser();
    }
  }, []);

  const [theme, colorMode] = useMode();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Themed Dashboard routes */}
      <Route path="/dashboard/*" element={<ThemedDashboardRoutes />}>
        <Route
          path="student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="professor"
          element={
            <ProtectedRoute>
              <ProfDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="hod"
          element={
            <ProtectedRoute>
              <HodDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dean"
          element={
            <ProtectedRoute>
              <DeanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/my-profile"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/book-appointments"
          element={
            <ProtectedRoute>
              <BookApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/prof-appointments"
          element={
            <ProtectedRoute>
              <ProfAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/todo"
          element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/timetable"
          element={
            <ProtectedRoute>
              <StudentTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="features/roomallocation"
          element={
            <ProtectedRoute>
              <RoomAllocation />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
