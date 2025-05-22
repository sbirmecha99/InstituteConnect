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

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOAuthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:3000/auth/google/callback",
	ClientID:     os.Getenv("google_clientID"),
	ClientSecret: os.Getenv("google_clientSECRET"),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
	Endpoint:     google.Endpoint,
}

func GoogleLogin(c *fiber.Ctx) error {
	url := googleOAuthConfig.AuthCodeURL("random-state", oauth2.AccessTypeOffline)
	return c.Redirect(url)
}

func GoogleCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	token, err := googleOAuthConfig.Exchange(content.Background(), code)
	if err != nil {
		log.Println("token exchaange offer", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	client := googleOAuthConfig.Client(context.Background(), token)
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
		if err := config.DB.Create(&user).Error; err != nil {
			log.Println("error creating user:", err)
			return c.SendStatus(http.StatusInternalServerError)
		}
	}
	//generate jwt
	jwtToken,err:=utils.GenerateJWT(user.Email,string(user.Role))
	if err!=nil{
		log.Println("jwt generation failed:",err)
		return c.SendStatus(http.StatusInternalServerError)
	}
	//send token and user data back
	return c.JSON(fiber.Map{
		"token":jwtToken,
		"user":fiber.Map{
			"name":user.Name,
			"email":user.Email,
			"role":user.Role,
		},
	})

}
