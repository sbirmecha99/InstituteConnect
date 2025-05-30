package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"github.com/gofiber/fiber/v2"
)

func CreateRoom(c *fiber.Ctx) error {
	room := new(models.Room)
	if err := c.BodyParser(room); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}

	if err := config.DB.Create(&room).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "could not create room"})
	}

	return c.Status(fiber.StatusCreated).JSON(room)
}
