// handlers/notification.go
package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"

	"github.com/gofiber/fiber/v2"
)

func CreateNotification(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "Admin" && role != "SuperAdmin" && role != "Prof" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var notif models.Notification
	if err := c.BodyParser(&notif); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	user := c.Locals("user").(models.User)
	notif.PostedByID = user.ID

	//check
	if !notif.IsGlobal &&notif.PostedFor==""{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":"Must specify class or role if not global",
		})
	}

	if err := config.DB.Create(&notif).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create notification"})
	}

	return c.Status(fiber.StatusCreated).JSON(notif)
}

func GetNotifications(c *fiber.Ctx) error {
	userInterface:=c.Locals("user")
	user,ok:=userInterface.(models.User)
	if !ok{
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error":"invalid user context"})
	}
	var notifications []models.Notification

	query := config.DB.Model(&models.Notification{}).Where(
		"is_global=? OR posted_for=?",
		true, user.Role,
	)
	
	if err := query.Order("created_at desc").Find(&notifications).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch notifications"})
	}
	return c.JSON(notifications)
}


