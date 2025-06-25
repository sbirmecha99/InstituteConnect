import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for event clicking, dragging, etc.
import axios from "axios";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/student/timetable", {
        withCredentials: true,
      })
      .then((res) => {
        const mapped = res.data.map((slot) => ({
          title: slot.course_code + " (" + slot.room.room_no + ")",
          start: convertToDate(slot.day, slot.start_time),
          end: convertToDate(slot.day, slot.end_time),
        }));
        setEvents(mapped);
      })
      .catch((err) => console.error("Error fetching timetable", err));
  }, []);

  const convertToDate = (dayStr, timeStr) => {
    const daysMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
    };

    const base = new Date("2024-06-24T00:00:00"); // Monday base date
    const dayOffset = daysMap[dayStr] - 1;

    const [hour, minute] = timeStr.slice(11, 16).split(":");
    const date = new Date(base);
    date.setDate(base.getDate() + dayOffset);
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    return date;
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        events={events}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
