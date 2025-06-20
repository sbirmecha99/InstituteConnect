package handlers

import (
	"fmt"
	"instituteconnect/config"
	"instituteconnect/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func RequestAppointment(c *fiber.Ctx)error{
	user := c.Locals("user").(models.User)
	if user.Role!= "Student"{
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error":"only students can request app"})
	}
	
	type RequestInput struct{
		FacultyEmail string `json:"faculty_email"`
		Subject string `json:"subject"`
	}

	var input RequestInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var faculty models.User
	if err := config.DB.Where("email = ?", input.FacultyEmail).First(&faculty).Error; err != nil || faculty.Role != "Prof" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid faculty email"})
	}

	var existing models.Appointment
if err:=config.DB.Where("student_id=? AND faculty_id=?AND status=?",user.ID,faculty.ID,models.Pending).First(&existing).Error;err==nil{
	return c.Status(fiber.StatusConflict).JSON(fiber.Map{
"error":"You already have a pending appointment with this Professor",
	})
	
}

	appointment := models.Appointment{
		StudentID: user.ID,
		FacultyID: faculty.ID,
		Status:    models.Pending,
		Subject: input.Subject,
	}

	if err := config.DB.Create(&appointment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create appointment"})
	}

	return c.Status(fiber.StatusCreated).JSON(appointment)
}
func GetAppointmentsForStudent(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	fmt.Println("student role check for apntmnt: ",user.Role)//debug
	if user.Role != "Student" {
		return c.Status(404).JSON(fiber.Map{"error": "only students can view appointments"})
	}

	var appts []models.Appointment
	if err := config.DB.
		Where("student_id = ?", user.ID).
		Preload("Faculty").
		Find(&appts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "could not get appointments"})
	}

	return c.JSON(fiber.Map{"appointments":appts})
}

func GetAppointmentsForProf(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Prof" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "only professors can view appointments"})
	}

	
	var appts []models.Appointment
	if err := config.DB.
		Where("faculty_id = ?", user.ID).
		Preload("Student").
		Find(&appts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "could not get appointments"})
	}

	return c.JSON(fiber.Map{"appointments":appts})
}


func UpdateAppointmentStatus(c *fiber.Ctx)error{
	user := c.Locals("user").(models.User)
	if user.Role!="Prof"{
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error":"only professors can update appointments"})
	}

	id:=c.Params("id")
	var appt models.Appointment
	if err:=config.DB.First(&appt,id).Error;err!=nil{
		return c.Status(404).JSON(fiber.Map{"error":"appointment not found"})
	}
	var input struct{
		Status string `json:"status"`
		TimeSlot time.Time `json:"time_slot"`
	}
	if err:=c.BodyParser(&input);err!=nil{
		return c.Status(400).JSON(fiber.Map{"error":"invalid input"})
	}
	if input.Status!="accepted" && input.Status != "declined"{
		return c.Status(400).JSON(fiber.Map{"error":"invalid status"})
	}
	appt.Status=models.AppointmentStatus(input.Status)
	if input.Status == string(models.Accepted) {
		appt.TimeSlot = input.TimeSlot
	}

	if err := config.DB.Save(&appt).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update appointment"})
	}

	return c.JSON(appt)
}
