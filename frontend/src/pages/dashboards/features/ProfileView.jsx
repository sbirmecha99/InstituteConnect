import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  colors,
  useTheme
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../../theme";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/me", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6">Failed to load user data</Typography>
      </Box>
    );
  }

  const { name, email, bio, department, semester, profile_picture, role } =
    user;

  return (
    <Box maxWidth={600} mx="auto" mt={5} px={3}>
      <Card
        elevation={5}
        sx={{
          borderRadius: 2,
          p: 3,
          background: `${colors.blueAccent[700]} !important`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" color="textSecondary">
            <strong>{role}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <CardContent sx={{ px: 0 }}>
          <Typography variant="body1" gutterBottom mb={1}>
            <strong>Email:</strong> {email || email}
          </Typography>

          {(role === "Student" || role === "Prof" || role === "Admin") &&
            department && (
              <Typography variant="body1" gutterBottom mb={1}>
                <strong>Department:</strong> {department || "N/A"}
              </Typography>
            )}

          {role === "Student" && semester && (
            <Typography variant="body1" gutterBottom mb={1}>
              <strong>Semester:</strong> {semester || "N/A"}
            </Typography>
          )}

          {(role === "Prof" || role === "Admin" || role === "Student") && (
            <Typography variant="body1" gutterBottom mb={1}>
              <strong>Bio:</strong> {bio || "No bio atm"}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileView;
