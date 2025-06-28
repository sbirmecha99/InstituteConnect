import React from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const DeanDashboard = () => {
  const theme = useTheme();

  const roomOccupancy = [
    { name: "Allocated", value: 75 },
    { name: "Free", value: 25 },
  ];

  const appointmentsPerDept = [
    { department: "CSE", requests: 12 },
    { department: "ECE", requests: 8 },
    { department: "ME", requests: 6 },
    { department: "CE", requests: 4 },
  ];

  const notificationsOverTime = [
    { date: "1 Jun", notifications: 5 },
    { date: "8 Jun", notifications: 8 },
    { date: "15 Jun", notifications: 6 },
    { date: "22 Jun", notifications: 10 },
    { date: "29 Jun", notifications: 7 },
  ];

  const COLORS = ["#1976d2", "#8884d8"];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Dean Dashboard
      </Typography>

      <Grid container spacing={{ xs: 3, md: 5 }}>
        {/* Appointment Requests Bar - full width */}
        <Grid item xs={12} md={12}>
          <Paper
            elevation={4}
            sx={{
              p: 6,
              borderRadius: 3,
              height: "100%",
              minHeight: 500,
              bgcolor:
                theme.palette.mode === "dark" ? "rgb(52, 52, 90)" : "#fff",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Appointment Requests per Department
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={appointmentsPerDept}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="department"
                  stroke={theme.palette.text.primary}
                />
                <YAxis stroke={theme.palette.text.primary} />
                <BarTooltip
                  contentStyle={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2e2e3e" : "#fff",
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend />
                <Bar dataKey="requests" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Notifications Over Time Line - full width */}
        <Grid item xs={12} md={12}>
          <Paper
            elevation={4}
            sx={{
              p: 6,
              borderRadius: 3,
              height: "100%",
              minHeight: 500,
              bgcolor:
                theme.palette.mode === "dark" ? "rgb(52, 52, 90)" : "#fff",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Notifications Sent Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={notificationsOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis dataKey="date" stroke={theme.palette.text.primary} />
                <YAxis stroke={theme.palette.text.primary} />
                <BarTooltip
                  contentStyle={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2e2e3e" : "#fff",
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="notifications"
                  stroke={theme.palette.secondary.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeanDashboard;
