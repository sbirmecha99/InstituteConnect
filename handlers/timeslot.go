package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

type timeSlotInput struct {
	Day         string `json:"day"`
	StartTime   string `json:"start_time"`   // e.g., "09:00"
	EndTime     string `json:"end_time"`     // e.g., "10:00"
	RoomID      uint   `json:"room_id"`
	CourseCode  string `json:"course_code"`
	Semester    int    `json:"semester"`
	Department  string `json:"department"`
	FacultyID   uint   `json:"faculty_id"`
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

	// Parse "HH:MM" to time.Time
	start, err1 := time.Parse("15:04", input.StartTime)
	end, err2 := time.Parse("15:04", input.EndTime)

	if err1 != nil || err2 != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid time format. Use HH:MM (24-hr)"})
	}

	// Set dummy date for consistent comparison
	d := time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC)
	start = time.Date(d.Year(), d.Month(), d.Day(), start.Hour(), start.Minute(), 0, 0, time.UTC)
	end = time.Date(d.Year(), d.Month(), d.Day(), end.Hour(), end.Minute(), 0, 0, time.UTC)

	// Validate WeekDay
	day := models.WeekDay(input.Day)
	validDays := map[models.WeekDay]bool{
		models.Monday: true, models.Tuesday: true, models.Wednesday: true,
		models.Thursday: true, models.Friday: true,
	}
	if !validDays[day] {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid day. Must be Monday to Friday"})
	}

	//room clashes
	var clash models.TimeSlot
if err := config.DB.
	Where("room_id = ? AND day = ? AND start_time < ? AND end_time > ?",
		input.RoomID, day, end, start).
	First(&clash).Error; err == nil {
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
		return c.Status(500).JSON(fiber.Map{"error": "Could not create timeslot, check if room id and fac id are valid"})
	}

	var created models.TimeSlot
config.DB.Preload("Room").Preload("Faculty").First(&created, timeslot.ID)
return c.Status(201).JSON(created)

}

//timetable for fac
func GetFacultyTimetable(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	if user.Role != "Prof" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only Professors can access their timetable",
		})
	}

	var slots []models.TimeSlot
	err := config.DB.Preload("Room").Where("faculty_id = ?", user.ID).Find(&slots).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch timetable"})
	}

	return c.JSON(slots)
}

//timetable for stydents
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
	err := config.DB.Preload("Room").Preload("Faculty").
		Where("semester = ? AND department = ?", user.Semester, user.Department).
		Order("day, start_time").
		Find(&slots).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch timetable"})
	}

	return c.JSON(slots)
}
