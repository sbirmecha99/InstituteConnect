package controllers

import (
	"context"
	"encoding/json"
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

	//if user already exists or not
	var user models.User
	result := config.DB.Where("google_id = ? OR email = ?", googleUser.ID, googleUser.Email).First(&user)

	if result.RowsAffected == 0 {
		
		//creating user with default role "student"
		user = models.User{
			Name:     googleUser.Name,
			Email:    googleUser.Email,
			GoogleID: googleUser.ID,
			Role:     models.Student,
		}
		config.DB.Create(&user)
		/* err := config.DB.Create(&user).Error; err != nil {
			log.Println("error creating user:", err)
			return c.SendStatus(http.StatusInternalServerError)
		}*/
	}else{
		if user.GoogleID==""{
			user.GoogleID=user.GoogleID
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
		Secure:   true,
	})
	return c.Redirect("/dashboard")
}

// email-password login
func Register(c *fiber.Ctx) error {
	var input struct {
		Email           string `form:"email"`
		Password        string `form:"password"`
		ConfirmPassword string `form:"confirmPassword"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("invalid input")
	}

	if input.Password != input.ConfirmPassword {
		return c.Status(fiber.StatusBadRequest).SendString("passwords do not match!")
	}

	if !strings.HasSuffix(input.Email, "@nitdgp.ac.in") {
		return c.Status(fiber.StatusBadRequest).SendString("only institute emails allowed")
	}

	var existing models.User
	result := config.DB.Where("email = ?", input.Email).First(&existing)

	if result.RowsAffected > 0 {
		if existing.Password!=""{
			//normal login already done
			return c.Status(fiber.StatusBadRequest).SendString("email already in use")
		}else{
			//already registered via google, now setting password
			hashed, err := utils.HashPassword(input.Password)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).SendString("could not hash password")
			}
			existing.Password = hashed
		if err := config.DB.Save(&existing).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to update password")
		}
		return c.Redirect("/") // password set
	}
}
//new user
	hashed,err:=utils.HashPassword(input.Password)
	if err!=nil{
		return c.Status(fiber.StatusInternalServerError).SendString("could not hash password")
	}
	user:= models.User{
		Email: input.Email,
		Password: hashed,
		Role: models.Student,
	}
 	
	if err:= config.DB.Create(&user).Error;err!=nil{
		return c.Status(fiber.StatusInternalServerError).SendString("failed to register user :(")
	}
	return c.Redirect("/")

}
