import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

const reminderOptions = [0, 5, 10, 15, 30, 60]; // minutes before

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [reminder, setReminder] = useState(0); // reminder in minutes

  const calendarRef = useRef();
  const audioRef = useRef(new Audio("/alarm.mp3")); // place your alarm.mp3 in public folder

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach((ev) => {
        const remindTime = dayjs(ev.start)
          .subtract(ev.reminder, "minute")
          .toDate();
        if (dayjs(now).isAfter(remindTime) && !ev.notified) {
          audioRef.current.play();
          alert(
            `Reminder: ${ev.title} starting at ${dayjs(ev.start).format(
              "h:mm A"
            )}`
          );
          ev.notified = true; // mark as notified
        }
      });
    }, 30000); // check every 30s

    return () => clearInterval(interval);
  }, [events]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setOpen(true);
  };

  const handleEventAdd = () => {
    if (!taskTitle.trim()) return;

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: taskTitle,
        start: selectedDate,
        end: dayjs(selectedDate).add(1, "hour").toDate(),
        color: "#1976d2",
        reminder,
        notified: false,
      },
    ]);

    setTaskTitle("");
    setReminder(0);
    setOpen(false);
  };

  const handleEventDropResize = (changeInfo) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === changeInfo.event.id
          ? {
              ...ev,
              start: changeInfo.event.start,
              end: changeInfo.event.end,
              notified: false, // reset notification
            }
          : ev
      )
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        🗓️ My Tasks
      </Typography>

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        events={events}
        height="auto"
        editable
        selectable
        selectMirror
        dateClick={handleDateClick}
        eventDrop={handleEventDropResize}
        eventResize={handleEventDropResize}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        eventDisplay="block"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }}
        dayHeaderFormat={{ weekday: "short" }}
        slotLabelFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
        contentHeight="auto"
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Task title"
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />

          <TextField
            select
            label="Reminder before start"
            value={reminder}
            onChange={(e) => setReminder(Number(e.target.value))}
          >
            {reminderOptions.map((min) => (
              <MenuItem key={min} value={min}>
                {min === 0 ? "No reminder" : `${min} min before`}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="caption" color="text.secondary">
            Task time: {dayjs(selectedDate).format("dddd, D MMM YYYY, h:mm A")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEventAdd} variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
