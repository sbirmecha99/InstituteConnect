package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/utils"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func getGoogleOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func Protected(c *fiber.Ctx) error {
	return c.SendString("accessed a protected route")
}
func GoogleLogin(c *fiber.Ctx) error {
	oauthconfig := getGoogleOAuthConfig()
	url := oauthconfig.AuthCodeURL("random-state", oauth2.AccessTypeOffline)
	return c.Redirect(url)
}

func GoogleCallback(c *fiber.Ctx) error {
	oauthconfig := getGoogleOAuthConfig()
	code := c.Query("code")
	token, err := oauthconfig.Exchange(context.Background(), code)
	if err != nil {
		log.Println("token exchaange offer", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	client := oauthconfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		log.Println("error getting user info:", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	defer resp.Body.Close()

	var googleUser struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		log.Println("failed to decode user info:", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	// insti mail check
	if !strings.HasSuffix(googleUser.Email, "@nitdgp.ac.in") {
		return c.Status(fiber.StatusForbidden).SendString("Only @nitdgp.ac.in emails allowed")
	}

	//if user already exists or not
	var user models.User
	result := config.DB.Where("google_id = ? OR email = ?", googleUser.ID, googleUser.Email).First(&user)

	if result.RowsAffected == 0 {

		//creating user
		userRole := utils.DetermineRole(googleUser.Email)
		user = models.User{
			Name:     googleUser.Name,
			Email:    googleUser.Email,
			GoogleID: googleUser.ID,
			Role:     models.Role(userRole),
		}
		config.DB.Create(&user)

	} else {
		if user.GoogleID == "" {
			user.GoogleID = googleUser.ID
			config.DB.Save(&user)
		}
	}
	//generate jwt
	jwtToken, err := utils.GenerateJWT(user.Email, string(user.Role),string(user.Name))
	if err != nil {
		log.Println("jwt generation failed:", err)
		return c.SendStatus(http.StatusInternalServerError)
	}
	//send token and user data back
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    jwtToken,
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		Path: "/",
	})
	var redirectURL string
switch user.Role {
case "SuperAdmin":
	redirectURL = "http://localhost:5173/dashboard/dean"
	case "Admin":
	redirectURL = "http://localhost:5173/dashboard/hod"
case "Prof":
	redirectURL = "http://localhost:5173/dashboard/professor"
case "Student":
	redirectURL = "http://localhost:5173/dashboard/student"
default:
	redirectURL = "http://localhost:5173/dashboard"
}

return c.Redirect(redirectURL)

}

// register
func Register(c *fiber.Ctx) error {
	var input struct {
		Name            string `json:"name"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirmPassword"`
	}

	if err := c.BodyParser(&input); err != nil {
		fmt.Println("Parse error:", err)
		return c.Status(400).SendString("invalid input")
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
	log.Println("user found:",result.RowsAffected)

	if result.RowsAffected == 0 || user.Password == "" {
		log.Println("User not found or password missing")
		return c.Status(fiber.StatusUnauthorized).SendString("user not found")
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		log.Println("Incorrect password")
		return c.Status(fiber.StatusUnauthorized).SendString("incorrect password")
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
		Secure: false,
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
func AuthVerify(c *fiber.Ctx) error {
	tokenStr := c.Cookies("token")
	
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

	// Handle profile image upload
	file, err := c.FormFile("image")
	if err == nil {
		filePath := fmt.Sprintf("./uploads/%d_%s", user.ID, file.Filename)
		if err := c.SaveFile(file, filePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save image"})
		}
		user.ProfilePicture = filePath
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

	if err := config.DB.Model(&user).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile"})
	}

	return c.JSON(fiber.Map{
		"message": "Profile updated successfully",
	"user":user,
	})
}
func Logout(c *fiber.Ctx) error {
	// Explicitly expire the cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		MaxAge:   -1,
		HTTPOnly: true,
		Path:     "/",       // must match login path
		Secure:   false,     // set to true in production
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

