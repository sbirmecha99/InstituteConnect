import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TodoList from "../../components/TodoList";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import StudentTimetable from "../../components/StudentTimetable";
import Calendar from "../../components/Calendar";
import BASE_URL from "../../api/config";

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [appointments, setAppointments] = useState([]);

  const formatSlot = (ts) => {
    if (
      !ts ||
      ts === "0001-01-01T00:00:00Z" ||
      ts === "0001-01-01T05:53:00+05:53" ||
      !dayjs(ts).isValid()
    )
      return null;

    return dayjs(ts).format("MMM D, YYYY h:mm A");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    let studentEmail = "";
    try {
      const decoded = jwtDecode(token);
      studentEmail = decoded.email;
    } catch (err) {
      console.error("JWT decode failed:", err);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/student/appointments`, {
          withCredentials:true,
          headers: { Authorization: `Bearer ${token}` },
        });

        const allAppointments = res.data.appointments || res.data || [];

        const filteredAppointments = allAppointments.filter(
          (a) => a.student?.email === studentEmail
        );

        setAppointments(filteredAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Box p={5}>
          <Grid container spacing={4}>
            {/* Classes for Today */}
            <Grid item xs={12} md={4}>
              <Card elevation={5} sx={{ background: colors.primary[400] }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    mb={2}
                    sx={{ color: colors.blueAccent[300] }}
                  >
                    <strong>Classes for Today</strong>
                  </Typography>
                  <StudentTimetable />
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming Appointments */}
            <Grid item xs={12} md={4}>
              <Card elevation={5} sx={{ background: colors.primary[400] }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    mb={2}
                    sx={{ color: colors.redAccent[300] }}
                  >
                    <strong>Appointment Status</strong>
                  </Typography>
                  {appointments.length === 0 ? (
                    <Typography>No appointments found</Typography>
                  ) : (
                    <List dense>
                      {appointments.map((appt) => {
                        let icon = null;
                        let iconColor = "";

                        if (appt.status.toLowerCase() === "accepted") {
                          icon = (
                            <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                          );
                        } else if (appt.status.toLowerCase() === "pending") {
                          icon = (
                            <HourglassTopIcon sx={{ color: "orange", mr: 1 }} />
                          );
                        } else if (appt.status.toLowerCase() === "declined") {
                          icon = <CancelIcon sx={{ color: "red", mr: 1 }} />;
                        }

                        return (
                          <ListItem key={appt.ID}>
                            {icon}
                            <ListItemText
                              primary={`${appt.faculty?.name ?? "Unknown"} - ${
                                appt.subject
                              }`}
                              secondary={
                                <>
                                  {formatSlot(appt.time_slot) ??
                                    "Time not allotted yet"}

                                  {" • "}
                                  <span style={{ textTransform: "capitalize" }}>
                                    {appt.status}
                                  </span>
                                </>
                              }
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                              }}
                              secondaryTypographyProps={{
                                fontSize: "0.8rem",
                                color: "gray",
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
