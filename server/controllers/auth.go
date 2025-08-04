package controllers

import (
	"context"
	"fmt"
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/utils"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	var input struct {
		Name            string `json:"name"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirmPassword"`
	}

	if err := c.BodyParser(&input); err != nil {
		fmt.Println("Parse error:", err)
		return c.Status(400).JSON(fiber.Map{
			"error":"invalid input",
	})
}
	if strings.TrimSpace(input.Name)==""{
		return c.Status(400).JSON(fiber.Map{
			"error":"All fields are required",
		})
	}
	if !strings.HasSuffix(strings.ToLower(input.Email), "@nitdgp.ac.in") {
		return c.Status(400).JSON(fiber.Map{
			"error":"Only @nitdgp.ac.in emails are allowed",
	})
	}

	if len(input.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password must be at least 6 characters",
		})
	}

	if input.Password != input.ConfirmPassword {
		return c.Status(400).SendString("passwords do not match!")
	}

	var existing models.User
	result := config.DB.Where("email = ?", input.Email).First(&existing)
	if result.RowsAffected > 0 {
		if existing.Password != "" {
			return c.Status(400).SendString("email already in use")
		} else {
			hashed, err := utils.HashPassword(input.Password)
			if err != nil {
				return c.Status(500).SendString("could not hash password")
			}
			existing.Password = hashed
			if err := config.DB.Save(&existing).Error; err != nil {
				return c.Status(500).SendString("failed to update password")
			}
			return c.Redirect("/") // updated password for Google OAuth user
		}
	}
	// New user
	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		return c.Status(500).SendString("could not hash password")
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed),
		Role:     models.Role(utils.DetermineRole(input.Email)),
		ProfilePicture: "https://res.cloudinary.com/dgjkoqlhc/image/upload/v1754141916/Default_pfp.svg_ydt686.png",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(500).SendString("failed to register user :(")
	}

	// Optional: return JSON or redirect based on frontend
	return c.JSON(fiber.Map{
		"message": "registration successful",
		"user":    user,
	})
}

//email password login

func EmailPasswordLogin(c *fiber.Ctx) error {
	log.Println("login endpoint hit")
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&input); err != nil {
		log.Println("error parsing body",err)
		return c.Status(fiber.StatusBadRequest).SendString("invalid input")
	}
	log.Println("Email:", input.Email)

	var user models.User
	result := config.DB.Where("email = ?", input.Email).First(&user)

	if result.RowsAffected == 0 || user.Password == "" {
		log.Println("User not found or password missing")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "user not found",
		  })
		  
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		log.Println("Incorrect password")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "incorrect password",
		  })
		  
	}

	//generate jwt
	token, err := utils.GenerateJWT(user.Email, string(user.Role),string(user.Name))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to generate token")
	}
	//redircet or send token
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		HTTPOnly: true,
		Path:     "/",
		Secure: true,
		SameSite: fiber.CookieSameSiteNoneMode,
	})

	if strings.Contains(c.Get("Accept"), "application/json") {
    return c.JSON(fiber.Map{
    "token": token,
    "user":  user,
})

} else {
    return c.Redirect("/dashboard")
}

}

func AuthVerify(c *fiber.Ctx) error {
	tokenStr := c.Cookies("token")
	log.Println(tokenStr)
	
	if tokenStr == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "No token present",
		})
	}

	claims, err := utils.ValidateJWT(tokenStr)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	// Extract email and role safely from MapClaims
	email, _ := claims["email"].(string)
	role, _ := claims["role"].(string)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"email": email,
		"role":  role,
	})
}

//update profile 
func UpdateProfile(c *fiber.Ctx) error {
	userVal := c.Locals("user")
	user, ok := userVal.(models.User)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	name := c.FormValue("name")
	program := c.FormValue("program")
	department := c.FormValue("department")
	semesterStr := c.FormValue("semester")

	// Update only if valid semester is provided
	var semester *int
	if semesterStr != "" {
		s, err := strconv.Atoi(semesterStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid semester"})
		}
		if program == "M.Tech" && s > 4 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "M.Tech has only 4 semesters"})
		}
		semester = &s
	}

	file, err := c.FormFile("image")
	if err == nil {
		// Upload to Cloudinary instead of local disk
		imageURL, err := utils.UploadToCloudinary(context.Background(),file)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to upload image"})
		}
		user.ProfilePicture = imageURL
	}

	// Prepare map of updates
	updates := map[string]interface{}{}
	if name != "" {
		updates["Name"] = name
	}
	if program != "" {
		updates["Program"] = program
	}
	if department != "" {
		updates["Department"] = department
	}
	if semester != nil {
		updates["Semester"] = *semester
	}
	if user.ProfilePicture != "" {
		updates["ProfilePicture"] = user.ProfilePicture
	}

	if len(updates) > 0 {
		if err := config.DB.Model(&user).Updates(updates).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile"})
		}
	}
	return c.JSON(fiber.Map{
		"message": "Profile updated successfully",
	"user":user,
	})
}
func Logout(c *fiber.Ctx) error {

	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		MaxAge:   -1,
		HTTPOnly: true,
		Path:     "/",       
		Secure:   true,  
		SameSite: fiber.CookieSameSiteNoneMode, 
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

