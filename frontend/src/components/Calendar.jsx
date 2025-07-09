import React, { useState, useRef, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const localizer = momentLocalizer(moment);

const categories = [
  { value: "High", color: "rgb(45, 168, 60)" },
  { value: "Medium", color: "rgb(48, 166, 181)" },
  { value: "Low", color: "rgb(239, 152, 13)" },
];

const MyTaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState(categories[0].value);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setTaskTitle("");
    setTaskCategory(categories[0].value);
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setTaskTitle(event.title);
    setTaskCategory(event.category);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;

    if (selectedEvent) {
      // Editing existing task
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                title: taskTitle,
                category: taskCategory,
                color: categories.find((c) => c.value === taskCategory).color,
              }
            : ev
        )
      );
      setSnackbar({ open: true, message: "Task updated" });
    } else {
      // Adding new task
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        start: selectedSlot.start,
        end: selectedSlot.end,
        category: taskCategory,
        color: categories.find((c) => c.value === taskCategory).color,
      };
      setEvents((prev) => [...prev, newTask]);
      setSnackbar({ open: true, message: "Task added" });
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
    setSnackbar({ open: true, message: "Task deleted" });
    setDialogOpen(false);
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      color: "#fff",
      borderRadius: "4px",
      paddingLeft: "4px",
      border: "none",
    },
  });

  return (
    <>
      <div style={{ height: "90vh", padding: 20 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
          defaultView="week"
          toolbar
          views={["week", "day"]}
          timeslots={2}
          step={30}
          popup
          components={{}}
        />
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedEvent ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
          <TextField
            select
            label="Priority"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.value}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedEvent ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyTaskCalendar;
