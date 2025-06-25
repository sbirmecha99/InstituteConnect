import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";


const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH", "MC", "BT", "MME"];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "12:00", end: "13:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
];

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [profs, setProfs] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [form, setForm] = useState({
    day: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    room_id: "",
    course_code: "",
    semester: "",
    department: "",
    faculty_id: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/rooms", {
        withCredentials: true,
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const fetchProfs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/professors", {
        withCredentials: true,
      });
      setProfs(res.data);
    } catch (err) {
      console.error("Failed to fetch professors", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchProfs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !form.day ||
      !form.start_time ||
      !form.end_time ||
      !form.room_id ||
      !form.course_code ||
      !form.semester ||
      !form.department ||
      !form.faculty_id
    ) {
      return setSnackbar({
        open: true,
        message: "All fields are required.",
        severity: "warning",
      });
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/create/timeslot",
        form,
        {
          withCredentials: true,
        }
      );
      setSnackbar({
        open: true,
        message: "Room allocated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to allocate room.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Room Allocation Panel
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Day"
              name="day"
              value={form.day}
              onChange={handleChange}
            >
              {daysOfWeek.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              select
              label="Start Time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot.start} value={slot.start}>
                  {slot.start}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              select
              label="End Time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot.end} value={slot.end}>
                  {slot.end}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Room"
              name="room_id"
              value={form.room_id}
              onChange={handleChange}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.room_no} ({room.building})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Faculty"
              name="faculty_id"
              value={form.faculty_id}
              onChange={handleChange}
            >
              {profs.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>
                  {prof.name} ({prof.department})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Course Code"
              name="course_code"
              value={form.course_code}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Semester"
              name="semester"
              type="number"
              value={form.semester}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Allocate Room"}
            </Button>
          </Grid>
        </Grid>
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

export default RoomAllocation;
