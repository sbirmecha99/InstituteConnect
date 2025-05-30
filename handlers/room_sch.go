package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"github.com/gofiber/fiber/v2"
)

func CreateRoomSch(c *fiber.Ctx) error {
	rs := new(models.RoomSchedule)
	if err := c.BodyParser(rs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}

	  //room exists or not
    var room models.Room
    if err := config.DB.First(&room, rs.RoomID).Error; err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "room not found"})
    }

	var faculty models.User
	if err:= config.DB.First(&faculty,rs.FacultyID).Error;err!=nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error":"faculty not found"})
	}
	if faculty.Role!="Prof"{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error":"user is not faculty"})
	}

	if err := config.DB.Create(&rs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "could not create room schedule"})
	}

	return c.Status(fiber.StatusCreated).JSON(rs)
}
