import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Card,
  Avatar,
  Stack,
} from "@mui/material";
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
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  People,
  NotificationsActive,
  MeetingRoom,
} from "@mui/icons-material";

const DeanDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // --- Data (Unchanged) ---
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

  // --- UI Styles ---
  const cardStyle = {
    p: 3,
    borderRadius: "24px",
    background: isDark ? "rgba(30, 30, 60, 0.6)" : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
    boxShadow: isDark
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
    height: "100%",
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ ...cardStyle, p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: `${color}20`,
            color: color,
            width: 56,
            height: 56,
            borderRadius: "16px",
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: "uppercase" }}
          >
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
          : "#f8faff",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            letterSpacing: "-1px",
            color: isDark ? "#fff" : "#1a237e",
          }}
        >
          Executive Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, Dean. Here is what's happening across departments today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value="30"
            icon={<People />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Room Occupancy"
            value="75%"
            icon={<MeetingRoom />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notifications"
            value="36"
            icon={<NotificationsActive />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Growth"
            value="+12%"
            icon={<TrendingUp />}
            color="#3b82f6"
          />
        </Grid>

        {/* Main Charts */}
        <Grid item xs={12} lg={8}>
          <Paper sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Appointment Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={appointmentsPerDept}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "rgba(255,255,255,0.1)" : "#eee"}
                />
                <XAxis dataKey="department" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <BarTooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="requests"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Occupancy Status
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={roomOccupancy}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill={isDark ? "#2e2e4e" : "#e2e8f0"} />
                </Pie>
                <PieTooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ textAlign: "center", mt: -20, mb: 12 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                75%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacity
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Engagement Analytics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={notificationsOverTime}>
                <defs>
                  <linearGradient id="colorNotif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "rgba(255,255,255,0.1)" : "#eee"}
                />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <BarTooltip />
                <Area
                  type="monotone"
                  dataKey="notifications"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNotif)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeanDashboard;
