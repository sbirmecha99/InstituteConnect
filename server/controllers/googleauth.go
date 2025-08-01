package controllers

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"

	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"google.golang.org/api/idtoken"
	"gorm.io/gorm"
)

func GoogleLogin(c *fiber.Ctx) error {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file:", err)
	}

	var body struct {
		Token string `json:"credential"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if body.Token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing token"})
	}

	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	if clientID == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Google client ID not configured"})
	}

	// Validate token
	payload, err := idtoken.Validate(context.Background(), body.Token, clientID)
	if err != nil {
		fmt.Println("Google token validation failed:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid Google token"})
	}

	email, ok := payload.Claims["email"].(string)
	if !ok || email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email not found in Google token"})
	}
	if !strings.HasSuffix(email, "@nitdgp.ac.in") {
    return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
        "error": "Only @nitdgp.ac.in emails are allowed",
    })
}

	name, _ := payload.Claims["name"].(string)

	db := config.DB
	var user models.User

	// Check if user exists
	result := db.Where("email = ?", email).First(&user)
	isNewUser := false

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// First-time Google login, create user
		user = models.User{
			Email:          email,
			Name:           name,
			Role:           "Student", // Default role, update logic if needed
			ProfilePicture: "/uploads/user.png",
		}
		if err := db.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
		}
		isNewUser = true
	} else if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	// Generate JWT
	token, err := utils.GenerateJWT(user.Email, string(user.Role), string(user.Name))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT"})
	}

	// Set JWT in cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		HTTPOnly: true,
		Secure:   true, // Set to true in production with HTTPS
		SameSite: "None",
	})

	return c.JSON(fiber.Map{
		"email":      user.Email,
		"name":       user.Name,
		"role":       user.Role,
		"isNewUser":  isNewUser,
	})
}
