import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { tokens } from "../../../theme";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BASE_URL from "../../../api/config";

const ProfAppointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [appointments, setAppointments] = useState([]);
  const [slotInputs, setSlotInputs] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const now = new Date();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/prof/appointments`,
        {
          withCredentials:true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdate = async (ID, status) => {
    const slot = slotInputs[ID];

    if (status === "accepted") {
      if (!slot || isNaN(new Date(slot).getTime())) {
        setSnackbar({
          open: true,
          message: "Please select a valid time slot.",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/appointments/${ID}`,
        {
          status,
          time_slot:
            status === "accepted" ? new Date(slot).toISOString() : null,
        },
        {
          withCredentials:true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update appointment:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Update failed.",
      });
    }
  };

  const pending = appointments.filter((a) => a.status === "pending");

  return (
    <Box p={5}>
      <Typography variant="h5" gutterBottom align="center" mb={2}>
        <strong>Your Appointments</strong>
      </Typography>

      {pending.length === 0 ? (
        <Typography>No pending requests</Typography>
      ) : (
        pending.map((appt) => (
          <Card key={appt.ID} sx={{ mb: 3 }}>
            <CardContent sx={{ background: `${colors.primary[400]}` }}>
              <Typography sx={{ mb: 2 }}>
                <strong>From:</strong> {appt.student?.name ?? "Unknown"}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Subject:</strong> {appt.subject}
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Pick a Date & Time"
                  value={
                    slotInputs[appt.ID] ? dayjs(slotInputs[appt.ID]) : null
                  }
                  onChange={(newValue) =>
                    setSlotInputs((prev) => ({
                      ...prev,
                      [appt.ID]: newValue.toISOString(),
                    }))
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: 250,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.paper",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleUpdate(appt.ID, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleUpdate(appt.ID, "declined")}
                >
                  Decline
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert severity="error" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfAppointments;
