import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  useTheme,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import StudentTimetable from "../../components/StudentTimetable";
import BASE_URL from "../../api/config";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isProfileIncomplete = !user.department || !user.program || !user.semester;

  const formatSlot = (ts) => {
    if (!ts || ts === "0001-01-01T00:00:00Z" || !dayjs(ts).isValid()) return null;
    return dayjs(ts).format("MMM D, YYYY • h:mm A");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let studentEmail = "";
    try {
      const decoded = jwtDecode(token);
      studentEmail = decoded.email;
    } catch (err) { return; }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/student/appointments`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const allAppointments = res.data.appointments || res.data || [];
        setAppointments(allAppointments.filter((a) => a.student?.email === studentEmail));
      } catch (err) { console.error(err); }
    };
    fetchAppointments();
  }, []);

  return (
    <Box p="20px">
      {/* 1. WELCOME & NUDGE SECTION */}
      <Paper
        elevation={0}
        sx={{
          background: isProfileIncomplete
            ? `linear-gradient(90deg, ${colors.blueAccent[700]} 0%, ${colors.primary[400]} 100%)`
            : `linear-gradient(90deg, ${colors.greenAccent[700]} 0%, ${colors.primary[400]} 100%)`,
          borderRadius: "15px",
          p: "30px",
          mb: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
            Welcome back, {user.name || "Student"}! 👋
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]} mt="5px">
            {isProfileIncomplete
              ? "Your profile is missing some details. Complete it to unlock all features."
              : "You're all caught up! Check your schedule below."}
          </Typography>
        </Box>
        {isProfileIncomplete && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate("/edit-profile")}
            sx={{
              backgroundColor: colors.blueAccent[500],
              padding: "10px 20px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
            }}
          >
            Complete Profile
          </Button>
        )}
      </Paper>

      {/* 2. MAIN CONTENT GRID */}
      <Grid container spacing={3}>
        {/* Timetable Card */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: colors.primary[400],
              borderRadius: "15px",
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box p="20px" borderBottom={`1px solid ${colors.primary[500]}`}>
              <Typography
                variant="h4"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Weekly Timetable
              </Typography>
            </Box>
            <Box p="20px">
              <StudentTimetable />
            </Box>
          </Card>
        </Grid>

        {/* Appointments Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: colors.primary[400],
              borderRadius: "15px",
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box p="20px" borderBottom={`1px solid ${colors.primary[500]}`}>
              <Typography
                variant="h4"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Appointment Status
              </Typography>
            </Box>
            <Box p="10px">
              {appointments.length === 0 ? (
                <Box textAlign="center" py="40px">
                  <Typography color={colors.grey[300]}>
                    No active appointments
                  </Typography>
                </Box>
              ) : (
                <List>
                  {appointments.map((appt) => (
                    <ListItem key={appt.ID} disablePadding>
                      {" "}
                      {/* Added disablePadding for better spacing */}
                      <Paper
                        elevation={0}
                        sx={{
                          width: "100%", // Ensure paper fills the list item
                          m: "5px 10px",
                          p: "10px",
                          background: colors.primary[500],
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { background: colors.primary[600] },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "transparent", mr: 2 }}>
                          {appt.status.toLowerCase() === "accepted" ? (
                            <CheckCircleIcon
                              sx={{ color: colors.greenAccent[500] }}
                            />
                          ) : appt.status.toLowerCase() === "pending" ? (
                            <HourglassTopIcon sx={{ color: "orange" }} />
                          ) : (
                            <CancelIcon sx={{ color: colors.redAccent[500] }} />
                          )}
                        </Avatar>
                        <ListItemText
                          primary={appt.faculty?.name || "Faculty Member"}
                          secondary={
                            formatSlot(appt.time_slot) || "Pending Review"
                          }
                          primaryTypographyProps={{
                            fontWeight: "700",
                            color: colors.grey[100],
                          }}
                          secondaryTypographyProps={{ color: colors.grey[400] }}
                        />
                      </Paper>
                    </ListItem> // Close ListItem AFTER Paper
                  ))}
                </List>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;