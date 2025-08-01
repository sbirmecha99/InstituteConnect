import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import BASE_URL from "../api/config";

const GetNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/get/notifications`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Notifications
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Typography>No notifications yet.</Typography>
      ) : (
        <Box>
          {messages.map((msg) => (
            <Paper
              key={msg.ID}
              elevation={3}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: msg.read
                  ? "background.paper"
                  : "rgba(100,149,237,0.1)",
              }}
            >
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                {msg.poster?.name || "Unknown"} ({msg.poster?.role || "Unknown"}
                )
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                {msg.message}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "right" }}
              >
                {dayjs(msg.CreatedAt).format("D MMM, h:mm A")}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default GetNotifications;
