import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { tokens } from "../../../theme";

const BookApp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [facultyList, setFacultyList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/professors", {
          withCredentials: true,
        });
        setFacultyList(res.data);
      } catch (err) {
        console.error("Failed to fetch professors", err);
      }
    };
    fetchProfessors();
  }, []);

  const handleSubmit = async () => {
    if (!selectedEmail || !subject.trim()) {
      setSnackbar({
        open: true,
        message: "Please select professor and give purpose",
        severity: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/appointments",
        {
          faculty_email: selectedEmail,
          subject:subject,
        },
        { withCredentials: true }
      );
      setSnackbar({
        open: true,
        message: "Appointment requested!",
        severity: "success",
      });
      setSelectedEmail("");
     
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to request appointment",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <Box maxWidth={600} mx="auto" mt={5} px={3}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 2,
            p: 3,
            background: `${colors.primary[400]} !important`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            mb={2}
            textAlign="center"
            color="textPrimary"
          >
            Book an Appointment
          </Typography>

          <CardContent sx={{ px: 0 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="faculty-label"
              >Select Professor</InputLabel>
              <Select
                labelId="faculty-label"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                {facultyList.map((prof) => (
                  <MenuItem key={prof.id} value={prof.email}>
                    {prof.name} ({prof.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "text.primary",
                          backgroundColor: `${colors.primary}`,
                          "& fieldset": {
                            borderColor: "rgba(124, 119, 119, 0.3)", // subtle default border
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#90caf9", // or any highlight color
                          },
                        },
                        "& label": {
                          color: "text.secondary",
                        },
                        "& label.Mui-focused": {
                          color: "#90caf9",
                        },
                      }}
            />

            <Button
              fullWidth
              variant="contained"
              color="red"
              sx={{ mt: 3 }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Request Appointment"
              )}
            </Button>
          </CardContent>
          <Box mt={2} display="flex" justifyContent="center">
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              anchorOrigin={{ vertical: "center", horizontal: "center" }}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              <Alert
                severity={snackbar.severity}
                variant="filled"
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Card>
      </Box>
  );
};

export default BookApp;
