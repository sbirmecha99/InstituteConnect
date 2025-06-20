import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
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

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    let studentEmail = "";
    try {
      const decoded = jwt_decode(token);
      studentEmail = decoded.email;
    } catch (err) {
      console.error("JWT decode failed:", err);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/student/appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const allAppointments = res.data.appointments || res.data || [];

        const upcoming = allAppointments.filter(
          (a) =>
            a.status.toLowerCase() === "accepted" &&
            new Date(a.time_slot) > new Date() &&
            a.student?.email === studentEmail
        );

        setAppointments(upcoming);
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
                  <Typography>Coming from Room Allotment DB</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* To-Do List */}
            <Grid item xs={12} md={4}>
              <Card elevation={5} sx={{ background: colors.primary[400] }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    mb={3}
                    sx={{ color: colors.greenAccent[500] }}
                  >
                    <strong>To-Do List</strong>
                  </Typography>
                  <TodoList />
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
                    sx={{ color: colors.redAccent[200] }}
                  >
                    <strong>Upcoming Appointments</strong>
                  </Typography>

                  {appointments.length === 0 ? (
                    <Typography>No upcoming appointments</Typography>
                  ) : (
                    <List dense>
                      {appointments.map((appt) => (
                        <ListItem key={appt.ID}>
                          <ListItemText
                            primary={`${appt.faculty?.name ?? "Unknown"} - ${
                              appt.subject
                            }`}
                            secondary={dayjs(appt.time_slot).format(
                              "MMM D, YYYY h:mm A"
                            )}
                          />
                        </ListItem>
                      ))}
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
