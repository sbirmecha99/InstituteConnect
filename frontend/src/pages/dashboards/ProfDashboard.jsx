import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import TodoList from "../../components/TodoList";
import { Checkbox, FormControlLabel } from "@mui/material";
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
import ProfessorTimetable from "../../components/ProfessorTimetable";
import BASE_URL from "../../api/config";

const ProfDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/prof/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.appointments || res.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === "accepted" && new Date(a.time_slot) > new Date()
  );

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Box p={5}>
          <Grid container spacing={5}>
            <Grid display="flex" size="auto">
              {/* Example Cards */}
              <Grid item xs={25} md={4}>
                <Card
                  elevation={5}
                  sx={{
                    background: `${colors.primary[400]}`,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      mb={2}
                      sx={{
                        color: `${colors.blueAccent[300]}`,
                      }}
                    >
                      <strong> Classes for Today</strong>
                    </Typography>
                    <ProfessorTimetable />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={5}
                sx={{
                  background: `${colors.primary[400]}`,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    mb={2}
                    sx={{
                      color: `${colors.redAccent[200]}`,
                    }}
                  >
                    <strong>Upcoming Appointments</strong>
                  </Typography>

                  {upcoming.length === 0 ? (
                    <Typography>No upcoming appointments</Typography>
                  ) : (
                    <List dense>
                      {upcoming.map((appt) => (
                        <ListItem key={appt.ID}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={appt.checked || false}
                                onChange={(e) => {
                                  const updated = upcoming.map((item) =>
                                    item.ID === appt.ID
                                      ? { ...item, checked: e.target.checked }
                                      : item
                                  );
                                  //logic
                                  console.log("Checkbox toggled", updated);
                                }}
                              />
                            }
                            label={
                              <ListItemText
                                primary={`${
                                  appt.student?.name ?? "Unknown"
                                } - ${appt.subject}`}
                                secondary={dayjs(appt.time_slot).format(
                                  "MMM D, YYYY h:mm A"
                                )}
                              />
                            }
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

export default ProfDashboard;
