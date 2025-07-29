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
import StudentTimetable from "./components/StudentTimetable";
import Calendar from "./components/Calendar";
import RoomAllocation from "./pages/dashboards/features/RoomAllocation";
import SendNotifications from "./components/SendNotifications";
import GetNotifications from "./components/GetNotifications";
import LandingPage from "./pages/LandingPage";
import ManageUsers from "./pages/ManageUsers";

// Wrapper for themed dashboard routes
const ThemedDashboardRoutes = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Box height="100vh">
              {/* Fixed Sidebar */}
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  height: "100vh",
                  width: "240px",
                  zIndex: 1000,
                }}
              >
                <Sidebar />
              </Box>

              {/* Main content area */}
              <Box
                sx={{
                  marginLeft: "240px", // leave space for sidebar
                  height: "100vh",
                  overflowY: "auto", // only this scrolls
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Topbar />
                <Box p={2} flex={1}>
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
      const token = localStorage.getItem("token");
      if (!token) return; // Don't proceed if token is missing

      try {
        const res = await axios.get("http://localhost:3000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
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
      <Route path="/" element={<LandingPage />} />
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
        <Route
          path="send/notifications"
          element={
            <ProtectedRoute>
              <SendNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="get/notifications"
          element={
            <ProtectedRoute>
              <GetNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
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
