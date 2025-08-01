package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"github.com/gofiber/fiber/v2"
)

//get all rooms
func GetRooms(c *fiber.Ctx)error{
	var rooms []models.Room
	if err:=config.DB.Find(&rooms).Error; err!=nil{
		return c.Status(500).JSON(fiber.Map{"error":"failed to fetch rooms"})
	}
	return c.JSON(rooms)

}
//get room by id
func GetRoom(c *fiber.Ctx)error{
	id:=c.Params("id")
	var room models.Room
	if err:=config.DB.First(&room,id).Error;err!=nil{
		return c.Status(404).JSON(fiber.Map{"error":"room not found"})
	}
	return c.JSON(room)
}

//create room
func BulkCreateRooms(c *fiber.Ctx) error {
	var rooms []models.Room 
	if err := c.BodyParser(&rooms); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid JSON input",
		})
	}

	if len(rooms) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "No rooms provided",
		})
	}

	// Bulk insert
	if err := config.DB.Create(&rooms).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Database error: " + err.Error(),
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Rooms created successfully",
		"count":   len(rooms),
	})
}



//updating room
func UpdateRoom(c *fiber.Ctx)error{
	id:=c.Params("id")
	var existing models.Room
	if err:=config.DB.First(&existing,id).Error;err!=nil{
		return c.Status(404).JSON(fiber.Map{"error":"Room not found"})
	}
room := new(models.Room)
	if err := c.BodyParser(room); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	existing.RoomNo = room.RoomNo
	if err := config.DB.Save(&existing).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update room"})
	}
	return c.JSON(existing)
}

// deletion
func DeleteRoom(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := config.DB.Delete(&models.Room{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete room"})
	}
	return c.SendStatus(204)
}