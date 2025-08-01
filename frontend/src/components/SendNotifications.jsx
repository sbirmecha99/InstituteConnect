import { useEffect, useState, useRef } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import dayjs from "dayjs";

const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH", "MC", "BT", "MME"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const SendNotifications = () => {
  const [message, setMessage] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [global, setGlobal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch (err) {
        console.error("Invalid notifications in localStorage:", err);
      }
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("`${BASE_URL}/api/prof/notifications", {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("notifications", JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) {
      setSnackbar({
        open: true,
        message: "Message cannot be empty.",
        severity: "error",
      });
      return;
    }
    if (!global && (!semester || !department)) {
      setSnackbar({
        open: true,
        message:
          "Select semester and department for class-specific notifications.",
        severity: "error",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/notifications`,
        {
          message,
          semester: global ? 0 : Number(semester),
          department: global ? "" : department,
          global,
        },
        { withCredentials: true }
      );

      const newMsg = res.data || {
        ID: Date.now(),
        message,
        CreatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);

      setSnackbar({
        open: true,
        message: "Notification sent!",
        severity: "success",
      });
      setMessage("");
      setSemester("");
      setDepartment("");
      setGlobal(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to send notification.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgb(23, 34, 52)" : "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Post Notification
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={global}
              onChange={(e) => setGlobal(e.target.checked)}
            />
          }
          label="Global Notification"
          sx={{ mb: 1 }}
        />

        {!global && (
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              select
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        <TextField
          placeholder="Write your notification..."
          multiline
          minRows={2}
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            color="success"
          >
            Send Notification
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Sent Notifications
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {messages.length === 0 ? (
            <Typography>No notifications yet.</Typography>
          ) : (
            messages.map((msg) => (
              <Paper
                key={msg.ID}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#2e3b4e" : "#e0f7fa",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "right", mt: 1 }}
                >
                  {dayjs(msg.CreatedAt).format("D MMM, h:mm A")}
                </Typography>
              </Paper>
            ))
          )}
          <div ref={chatEndRef} />
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SendNotifications;
