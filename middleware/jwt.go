package middleware

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/utils"

	"github.com/gofiber/fiber/v2"
)

func JWTProtected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get token from Authorization header first
		token := c.Get("Authorization")
		if token == "" {
			// Fallback to cookie if header not present
			token = c.Cookies("token")
		}

		// Remove "Bearer " prefix if using Authorization header
		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}

		if token == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing or invalid token",
			})
		}

		claims, err := utils.ValidateJWT(token)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		email, ok := claims["email"].(string)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token payload",
			})
		}

		var user models.User
		result := config.DB.Where("email = ?", email).First(&user)
		if result.Error != nil || result.RowsAffected == 0 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not found",
			})
		}

		c.Locals("user", user)
		c.Locals("role",user.Role)
		return c.Next()
	}
}
