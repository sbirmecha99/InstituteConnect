package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func RequestAppointment(c *fiber.Ctx)error{
	role:= c.Locals("role")
	if role!= "Student"{
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error":"only students can request app"})
	}

	user:= c.Locals("user").(models.User)
	
	type RequestInput struct{
		FacultyEmail string `json:"faculty_email"`
	}

	var input RequestInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var faculty models.User
	if err := config.DB.Where("email = ?", input.FacultyEmail).First(&faculty).Error; err != nil || faculty.Role != "Prof" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid faculty email"})
	}

	appointment := models.Appointment{
		StudentID: user.ID,
		FacultyID: faculty.ID,
		Status:    models.Pending,
	}

	if err := config.DB.Create(&appointment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create appointment"})
	}

	return c.Status(fiber.StatusCreated).JSON(appointment)
}

func GetAppointmentsForProf(c *fiber.Ctx)error{
	role:=c.Locals("role")
	if role!="Prof"{
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error":"only professors can view appointments"})
	}
	user:=c.Locals("user").(models.User)

	var appts []models.Appointment
	if err:= config.DB.Where("prof_id = ?",user.ID).Find(&appts).Error;err!=nil{
		return c.Status(500).JSON(fiber.Map{"error":"could not get appointments"})
	}
	return c.JSON(appts)
}

func UpdateAppointmentStatus(c *fiber.Ctx)error{
	role:=c.Locals("role")
	if role!="Prof"{
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
	if input.Status!="Accepted" && input.Status != "Declined"{
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