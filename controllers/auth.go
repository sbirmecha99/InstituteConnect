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
	"strings"

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
	jwtToken, err := utils.GenerateJWT(user.Email, string(user.Role))
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
	})
	return c.Redirect("http://localhost:5173/dashboard")

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
	token, err := utils.GenerateJWT(user.Email, string(user.Role))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to generate token")
	}
	//redircet or send token
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		HTTPOnly: true,
		Path:     "/",
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

    userEmail, err := utils.ValidateJWT(tokenStr)
    if err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
    }

    var user models.User
    if err := config.DB.Where("email = ?", userEmail).First(&user).Error; err != nil {
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
