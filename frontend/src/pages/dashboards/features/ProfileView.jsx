import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../../theme";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

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
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000";

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
        <Typography variant="h6" color="error">
          Failed to load user data
        </Typography>
      </Box>
    );
  }

  const { name, email, bio, department, semester, profile_picture, role } =
    user;

  // Replace these with real user data later
  const socials = {
    linkedin: "https://linkedin.com/in/username",
    github: "https://github.com/username",
    twitter: "https://twitter.com/username",
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6} px={3}>
      <Card
        elevation={8}
        sx={{
          borderRadius: 4,
          p: 4,
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.blueAccent[700]} 100%)`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
         
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              textTransform: "capitalize",
              color: textColor,
            }}
          >
            {name || "Unknown User"}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ color: textColor, opacity: 0.8, mb: 0.5 }}
          >
            {role || "Role Unknown"}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.3)" }} />

        <CardContent sx={{ px: 0 }}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ mb: 2, color: textColor, fontSize: "1rem" }}
          >
            <strong>Email:</strong> {email || "N/A"}
          </Typography>

          {(role === "Student" || role === "Prof" || role === "Admin") &&
            department && (
              <Typography
                variant="body1"
                gutterBottom
                sx={{ mb: 2, color: textColor, fontSize: "1rem" }}
              >
                <strong>Department:</strong> {department || "N/A"}
              </Typography>
            )}

          {role === "Student" && semester && (
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mb: 2, color: textColor, fontSize: "1rem" }}
            >
              <strong>Semester:</strong> {semester || "N/A"}
            </Typography>
          )}

          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: textColor, fontSize: "1rem" }}
          >
            <strong>Bio:</strong> {bio || "No bio available"}
          </Typography>

          <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.3)" }} />

          <Box display="flex" justifyContent="center" gap={2}>
            <Tooltip title="LinkedIn" arrow>
              <IconButton
                component="a"
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: textColor }}
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="GitHub" arrow>
              <IconButton
                component="a"
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: textColor }}
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Twitter" arrow>
              <IconButton
                component="a"
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: textColor }}
              >
                <TwitterIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileView;
