import { useEffect, useState, useRef } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const GetNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/get/notifications",
          {
            withCredentials: true,
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "url('/chatbg2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "brightness(0.7)",
          position: "relative",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Notifications
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : messages.length === 0 ? (
            <Typography>No notifications yet.</Typography>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.ID}
                sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: "#e0f7fa",
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "black", fontWeight: 600 }}
                  >
                    {msg.poster?.name || "Unknown"} (
                    {msg.poster?.role || "Unknown"})
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ wordBreak: "break-word", color: "black" }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      color: "black",
                    }}
                  >
                    {dayjs(msg.CreatedAt).format("D MMM, h:mm A")}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
          <div ref={chatEndRef} />
        </Box>
      </Paper>
    </Container>
  );
};

export default GetNotifications;
