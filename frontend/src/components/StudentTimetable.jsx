import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import BASE_URL from "../api/config";

const StudentTimetable = () => {
  const theme = useTheme();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { label: "09:00 - 10:00", start: "09:00" },
    { label: "10:00 - 11:00", start: "10:00" },
    { label: "11:00 - 12:00", start: "11:00" },
    { label: "12:00 - 13:00", start: "12:00" },
    { label: "13:00 - 14:00", start: "13:00" },
    { label: "14:00 - 15:00", start: "14:00" },
    { label: "15:00 - 16:00", start: "15:00" },
  ];

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/student/timetable`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("fetched slots:", res.data);
        setSlots(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching slots", err))
      .finally(() => setLoading(false));
  }, []);
  const convertToIST = (utcTimeStr) => {
    const [hour, minute] = utcTimeStr.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hour, minute, 0);
    const ist = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    return ist.toTimeString().slice(0, 5); // e.g., "09:00"
  };
  const getClassAt = (day, timeStart) => {
    const safeSlots = Array.isArray(slots) ? slots : [];
    const slot = safeSlots.find(
      (slot) => slot.day === day && convertToIST(slot.start_time) === timeStart
    );
    if (slot) console.log("Matched Slot:", { day, timeStart, slot });
    return slot;
  };



  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{
          py: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        Weekly Timetable
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.action.hover,
                  py: 1,
                  px: 1.5,
                }}
              >
                Day
              </TableCell>
              {timeSlots.map((ts) => (
                <TableCell
                  key={ts.start}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.action.hover,
                    py: 1,
                    px: 1.5,
                    fontSize: "0.8rem",
                  }}
                >
                  {ts.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    py: 1,
                    px: 1.5,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {day}
                </TableCell>
                {timeSlots.map((ts) => {
                  const slot = getClassAt(day, ts.start);
                  return (
                    <TableCell
                      key={day + ts.start}
                      align="center"
                      sx={{
                        py: 1,
                        px: 1,
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          cursor: slot ? "pointer" : "default",
                        },
                      }}
                    >
                      {slot ? (
                        <Box sx={{ fontSize: "0.75rem" }}>
                          <Box sx={{ fontWeight: 600 }}>{slot.course_code}</Box>
                          <Chip
                            label={slot.Room.room_no}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              color: theme.palette.secondary.contrastText,
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                          <Box
                            sx={{
                              fontSize: "0.7rem",
                              color: theme.palette.background.primary,
                              mt: 0.3,
                            }}
                          >
                            {slot.Faculty.name}
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default StudentTimetable;
