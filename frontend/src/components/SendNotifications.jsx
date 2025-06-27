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
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import dayjs from "dayjs";
import isSameDay from "dayjs";
dayjs.extend(isSameDay);

const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH", "MC", "BT", "MME"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const SendNotifications = () => {
  const theme=useTheme();
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
      const res = await axios.get("http://localhost:3000/api/get/notifications", {
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
        "http://localhost:3000/api/notifications",
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

  let lastDate = null;

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
      }}
    >
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
        <Typography variant="h5" gutterBottom>
          Notifications Chat
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
          <>
            <TextField
              select
              fullWidth
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              sx={{ mb: 2 }}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ mb: 2 }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            flex: 1,
            p: 2,
            backgroundImage: "url('/chatbg2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backdropFilter: "brightness(0.7)",
            position: "relative",
          }}
        >
          {messages.map((msg, idx) => {
            const createdDate = dayjs(msg.CreatedAt);
            const prevDate =
              idx > 0 ? dayjs(messages[idx - 1].CreatedAt) : null;
            const showDateDivider =
              !prevDate || !createdDate.isSame(prevDate, "day");

            return (
              <Box key={msg.ID}>
                {showDateDivider && (
                  <Divider sx={{ my: 2}}>
                    <Typography variant="caption" color="black">
                      {createdDate.format("ddd, D MMM YYYY")}
                    </Typography>
                  </Divider>
                )}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#2e3b4e" : "#e0f7fa",
                      color: (theme) => theme.palette.text.primary,
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {msg.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        color: "text.secondary",
                      }}
                    >
                      {createdDate.format("D MMM, h:mm A")}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            );
          })}
          <div ref={chatEndRef} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            pt: 1,
          }}
        >
          <TextField
            placeholder="Type your notification..."
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}
          />
          <IconButton onClick={handleSend} sx={{ ml: 1 }}>
            <SendIcon
              sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#1976d2" }}
            />
          </IconButton>
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
