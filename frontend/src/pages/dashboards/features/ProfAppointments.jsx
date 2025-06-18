// ProfAppointments.jsx

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ProfAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/professors", {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdate = async (id, status, timeSlot) => {
    try {
      await axios.put(
        `http://localhost:3000/api/appointments/${id}`,
        {
          status,
          time_slot: timeSlot ? new Date(timeSlot).toISOString() : null,
        },
        { withCredentials: true }
      );
      // Refresh appointments after update
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.ID === id
            ? { ...appt, Status: status, TimeSlot: timeSlot }
            : appt
        )
      );
    } catch (err) {
      console.error("Failed to update appointment", err);
    }
  };

  if (loading) return <p>Loading Appointments...</p>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3} gutterBottom>
        Your Appointment Requests
      </Typography>
      {appointments.length === 0 ? (
        <Typography>No appointments found</Typography>
      ) : (
        appointments.map((appt) => (
          <Card key={appt.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography>
                <strong>From:</strong>{" "} 
                {appt.Student?.name?? <em>Unknown Student</em>}
              </Typography>
              <Typography>
                <strong>Subject:</strong> {appt.Subject}
              </Typography>
              <Typography>
                <strong>Status:</strong> {appt.Status}
              </Typography>

              {appt.Status === "Pending" && (
                <Stack spacing={1} mt={2} direction="column">
                  <TextField
                    label="Slot Date & Time"
                    type="datetime-local"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      appt._selectedSlot = e.target.value;
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleUpdate(appt.ID, "Accepted", appt._selectedSlot)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleUpdate(appt.ID, "Declined", null)}
                    >
                      Decline
                    </Button>
                  </Stack>
                </Stack>
              )}

              {appt.Status === "Accepted" && (
                <Typography mt={1}>
                  <strong>Slot:</strong>{" "}
                  {appt.TimeSlot
                    ? dayjs(appt.TimeSlot).format("MMM D, YYYY h:mm A")
                    : "Not set"}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ProfAppointments;
