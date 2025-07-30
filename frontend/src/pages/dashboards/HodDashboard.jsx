import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const HodDashboard = ({ allUsers = [], allRooms = [], appointments = [] }) => {
  const theme = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const department = storedUser?.department;

  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);

  useEffect(() => {
    if (!department) return;

    const profs = allUsers.filter(
      (u) => u.role === "Professor" && u.department === department
    );
    const students = allUsers.filter(
      (u) => u.role === "Student" && u.department === department
    );
    const rooms = allRooms.filter((r) => r.department === department);
    const pending = appointments.filter(
      (a) =>
        a.faculty?.department === department &&
        a.status?.toLowerCase() === "pending"
    );

    setFacultyCount(profs.length);
    setStudentCount(students.length);
    setRoomCount(rooms.length);
    setPendingAppointments(pending.length);
  }, [allUsers, allRooms, appointments, department]);

  const stats = [
    {
      label: "Professors in Dept",
      value: facultyCount,
      icon: <GroupIcon fontSize="large" />,
      color: "#3f51b5",
    },
    {
      label: "Students in Dept",
      value: studentCount,
      icon: <SchoolIcon fontSize="large" />,
      color: "#009688",
    },
    {
      label: "Rooms Allotted",
      value: roomCount,
      icon: <MeetingRoomIcon fontSize="large" />,
      color: "#f57c00",
    },
    {
      label: "Pending Appointments",
      value: pendingAppointments,
      icon: <CalendarTodayIcon fontSize="large" />,
      color: "#d32f2f",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Department at a Glance
      </Typography>

      <Grid container spacing={3} mt={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: stat.color,
                color: "#fff",
                borderRadius: 2,
              }}
            >
              {stat.icon}
              <Typography variant="h6" mt={1}>
                {stat.value}
              </Typography>
              <Typography variant="body1">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HodDashboard;
