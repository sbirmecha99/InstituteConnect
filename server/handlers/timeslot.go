package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

type timeSlotInput struct {
	Day        string `json:"day"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
	RoomID     uint   `json:"room_id"`
	CourseCode string `json:"course_code"`
	Semester   int    `json:"semester"`
	Department string `json:"department"`
	FacultyID  uint   `json:"faculty_id"`
}

type timeSlotResponse struct {
	ID         uint           `json:"ID"`
	Day        string         `json:"day"`
	StartTime  string         `json:"start_time"`
	EndTime    string         `json:"end_time"`
	Room       models.Room    `json:"Room"`
	Faculty    models.User `json:"Faculty"`
	CourseCode string         `json:"course_code"`
	Semester   int            `json:"semester"`
	Department string         `json:"department"`
}

func CreateTimeSlot(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "SuperAdmin" && user.Role != "Admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only Admins and SuperAdmins can create timeslots",
		})
	}

	var input timeSlotInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	start, err1 := time.Parse("15:04", input.StartTime)
	end, err2 := time.Parse("15:04", input.EndTime)

	if err1 != nil || err2 != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid time format. Use HH:MM (24-hr)"})
	}

	loc := time.FixedZone("IST", 5.5*3600)
start = time.Date(2000, 1, 1, start.Hour(), start.Minute(), 0, 0, loc)
end = time.Date(2000, 1, 1, end.Hour(), end.Minute(), 0, 0, loc)

	// Validate weekday
	day := models.WeekDay(input.Day)
	validDays := map[models.WeekDay]bool{
		models.Monday: true, models.Tuesday: true, models.Wednesday: true,
		models.Thursday: true, models.Friday: true,
	}
	if !validDays[day] {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid day. Must be Monday to Friday"})
	}

	// Room clash check
	var clash models.TimeSlot
	if err := config.DB.Where("room_id = ? AND day = ? AND start_time < ? AND end_time > ?",
		input.RoomID, day, end, start).First(&clash).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "Room already booked during this timeslot"})
	}

	timeslot := models.TimeSlot{
		Day:        day,
		StartTime:  start,
		EndTime:    end,
		RoomID:     input.RoomID,
		CourseCode: input.CourseCode,
		Semester:   input.Semester,
		Department: input.Department,
		FacultyID:  input.FacultyID,
	}

	if err := config.DB.Create(&timeslot).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create timeslot"})
	}

	var created models.TimeSlot
	config.DB.Preload("Room").Preload("Faculty").First(&created, timeslot.ID)

	return c.Status(201).JSON(timeSlotResponse{
		ID:         created.ID,
		Day:        string(created.Day),
		StartTime:  created.StartTime.Format("15:04"),
		EndTime:    created.EndTime.Format("15:04"),
		Room:       created.Room,
		Faculty:    created.Faculty,
		CourseCode: created.CourseCode,
		Semester:   created.Semester,
		Department: created.Department,
	})
}

func GetFacultyTimetable(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok || user.Role != "Prof" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only Professors can access their timetable",
		})
	}

	var slots []models.TimeSlot
	if err := config.DB.
		Preload("Room").
		Preload("Faculty").
		Where("faculty_id = ?", user.ID).
		Order("day, start_time").
		Find(&slots).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch timetable"})
	}

	var response []timeSlotResponse
	for _, slot := range slots {
		response = append(response, timeSlotResponse{
			ID:         slot.ID,
			Day:        string(slot.Day),
			StartTime:  slot.StartTime.Format("15:04"),
			EndTime:    slot.EndTime.Format("15:04"),
			Room:       slot.Room,
			Faculty:    slot.Faculty,
			CourseCode: slot.CourseCode,
			Semester:   slot.Semester,
			Department: slot.Department,
		})
	}

	return c.JSON(response)
}


func GetStudentTimetable(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Student" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only Students can access their timetable",
		})
	}

	if user.Semester == 0 || user.Department == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Incomplete student profile"})
	}
	

	var slots []models.TimeSlot
	if err := config.DB.Preload("Room").Preload("Faculty").
		Where("semester = ? AND department = ?", user.Semester, user.Department).
		Order("day, start_time").Find(&slots).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch timetable"})
	}

	var response []timeSlotResponse
	for _, slot := range slots {
		response = append(response, timeSlotResponse{
			ID:         slot.ID,
			Day:        string(slot.Day),
			StartTime:  slot.StartTime.Format("15:04"),
			EndTime:    slot.EndTime.Format("15:04"),
			Room:       slot.Room,
			Faculty:    slot.Faculty,
			CourseCode: slot.CourseCode,
			Semester:   slot.Semester,
			Department: slot.Department,
		})
	}
	

	return c.JSON(response)
}

func UpdateTimeSlot(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "SuperAdmin" && user.Role != "Admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only Admins and SuperAdmins can update timeslots",
		})
	}

	id := c.Params("id")
	var input timeSlotInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Parse and normalize time
	startParsed, err1 := time.Parse("15:04", input.StartTime)
	endParsed, err2 := time.Parse("15:04", input.EndTime)
	if err1 != nil || err2 != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid time format. Use HH:MM"})
	}
	if !startParsed.Before(endParsed) {
		return c.Status(400).JSON(fiber.Map{"error": "Start time must be before end time"})
	}
	loc := time.FixedZone("Asia/Kolkata", 5.5*3600)
	dummyDate := time.Date(2000, 1, 1, 0, 0, 0, 0, loc)
	start := time.Date(dummyDate.Year(), dummyDate.Month(), dummyDate.Day(), startParsed.Hour(), startParsed.Minute(), 0, 0, loc)
	end := time.Date(dummyDate.Year(), dummyDate.Month(), dummyDate.Day(), endParsed.Hour(), endParsed.Minute(), 0, 0, loc)

	//weekday check
	day := models.WeekDay(input.Day)
	validDays := map[models.WeekDay]bool{
		models.Monday: true, models.Tuesday: true, models.Wednesday: true,
		models.Thursday: true, models.Friday: true,
	}
	if !validDays[day] {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid day. Must be Monday to Friday"})
	}
	
	var existing models.TimeSlot
	if err := config.DB.First(&existing, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Timeslot not found"})
	}

	// Check room clash (excluding itself)
	var clash models.TimeSlot
	if err := config.DB.
		Where("id != ? AND room_id = ? AND day = ? AND start_time < ? AND end_time > ?",
			id, input.RoomID, day, end, start).
		First(&clash).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "Room already booked during this timeslot"})
	}

	// Update the timeslot
	existing.Day = day
	existing.StartTime = start
	existing.EndTime = end
	existing.RoomID = input.RoomID
	existing.CourseCode = input.CourseCode
	existing.Semester = input.Semester
	existing.Department = input.Department
	existing.FacultyID = input.FacultyID

	if err := config.DB.Save(&existing).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update timeslot"})
	}

	// Return updated with joins
	var updated models.TimeSlot
	config.DB.Preload("Room").Preload("Faculty").First(&updated, existing.ID)

	return c.JSON(updated)
}
