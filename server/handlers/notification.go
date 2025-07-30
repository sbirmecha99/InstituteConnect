// handlers/notification.go
package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateNotification(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Admin" && user.Role != "SuperAdmin" && user.Role != "Prof" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var input struct {
		Message    string  `json:"message"`
		Semester   *int    `json:"semester"`
		Department *string `json:"department"`
		Global     bool    `json:"global"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Message cannot be empty"})
	}

	if !input.Global && (input.Semester == nil || input.Department == nil) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Must specify semester and department if not global"})
	}

	notif := models.Notification{
		Message:    input.Message,
		Semester:   input.Semester,
		Department: input.Department,
		Global:     input.Global,
		CreatedBy:  user.ID,
	}

	if err := config.DB.Create(&notif).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create notification"})
	}

	return c.Status(201).JSON(notif)
}


func GetNotifications(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	var notifications []models.Notification

	if err := config.DB.
		Preload("Poster").
		Where("global = ? OR (semester = ? AND department = ?)",
			true, user.Semester, user.Department).
		Order("created_at desc").
		Find(&notifications).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch notifications"})
	}

	return c.JSON(notifications)
}
func GetAllNotifications(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Admin" && user.Role != "SuperAdmin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var notifications []models.Notification
	if err := config.DB.Order("created_at desc").Find(&notifications).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch notifications"})
	}

	return c.JSON(notifications)
}
func GetProfNotifications(c *fiber.Ctx) error {
    user := c.Locals("user").(models.User)
    if user.Role != "Prof" {
        return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
    }

    var notifications []models.Notification
    if err := config.DB.
        Where("created_by = ?", user.ID).
        Order("created_at DESC").
        Find(&notifications).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Could not fetch notifications"})
    }

    return c.JSON(notifications)
}

func DeleteNotification(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Admin" && user.Role != "SuperAdmin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id := c.Params("id")
	if err := config.DB.Delete(&models.Notification{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not delete notification"})
	}

	return c.SendStatus(204)
}
func EditNotification(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Role != "Admin" && user.Role != "SuperAdmin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id := c.Params("id")
	var notif models.Notification
	if err := config.DB.First(&notif, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Notification not found"})
	}

	// Check edit window (10 minutes from CreatedAt)
	editDeadline := notif.CreatedAt.Add(10 * time.Minute)
	if time.Now().After(editDeadline) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Edit window expired. Notifications can only be edited within 10 minutes of creation."})
	}

	var input struct {
		Message string `json:"message"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Message == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Message cannot be empty"})
	}

	notif.Message = input.Message

	if err := config.DB.Save(&notif).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not update notification"})
	}

	return c.JSON(notif)
}
