import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Your Login page component
import Dashboard from "./pages/Dashboard"; // Your Dashboard page component
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ProfDashboard from "./pages/dashboards/ProfDashboard";
import DeanDashboard from "./pages/dashboards/DeanDashboard";
import HodDashboard from "./pages/dashboards/HodDashboard";
import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

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
              <Box display="flex" flexDirection="column" flexGrow={1}>
                <Topbar />
                <Box p={2}>
                  <Routes>
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
                  </Routes>
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
  const [theme, colorMode] = useMode();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Themed Dashboard routes */}
      <Route path="/dashboard/*" element={<ThemedDashboardRoutes />} />

      {/* Catch-all */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
