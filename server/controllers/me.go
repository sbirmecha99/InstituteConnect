package controllers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/utils"

	"github.com/gofiber/fiber/v2"
)
func Me(c *fiber.Ctx)error{
	tokenStr := c.Cookies("token")
	
    if tokenStr == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthenticated"})
    }

    claims, err := utils.ValidateJWT(tokenStr)
    if err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
    }
	email, ok := claims["email"].(string)
if !ok {
    return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
        "error": "Invalid token payload",
    })
}

    var user models.User
    if err := config.DB.Where("email = ?", email).First(&user).Error; err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "user not found"})
    }

    return c.JSON(fiber.Map{"user": user})
}
