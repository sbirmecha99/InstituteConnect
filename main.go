package main

import (
	"instituteconnect/auth"
	"instituteconnect/config"
	"instituteconnect/models"

	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/gorilla/pat"
	"github.com/markbates/goth/gothic"


)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading env file")
	}
	config.ConnectDatabase()

	error := config.DB.AutoMigrate(
		&models.User{},
		&models.Room{},
		&models.Appointment{},
		&models.Notification{},
	)
	if error != nil {
		log.Fatal("automigration failure: ", error)
	}
	log.Println("migration successful!")

	// Init Google OAuth
	auth.Init() // You define this in auth/google.go

	// Setup routes
	r := pat.New()

	// Start Google OAuth
	r.Get("/auth/{provider}", func(w http.ResponseWriter, r *http.Request) {
		gothic.BeginAuthHandler(w, r)
	})

	// Handle callback after login
	r.Get("/auth/{provider}/callback", func(w http.ResponseWriter, r *http.Request) {
		user, err := gothic.CompleteUserAuth(w, r)
		if err != nil {
			http.Redirect(w, r, "/auth/google", http.StatusTemporaryRedirect)
			return
		}

		// 🧠 Check if user exists in DB, otherwise create
		var existing models.User
		result := config.DB.Where("email = ?", user.Email).First(&existing)

		if result.Error != nil {
			// New user — create it
			newUser := models.User{
				Name:     user.Name,
				Email:    user.Email,
				GoogleID: user.UserID,
				Role:     models.Student, // or default to Student, change as needed
			}
			config.DB.Create(&newUser)
			log.Println("New user created:", newUser.Email)
		} else {
			log.Println("User already exists:", existing.Email)
		}

		// You can return a success message or redirect to a dashboard
		w.Write([]byte("Logged in as: " + user.Email))
	})

	log.Println("Server started on http://localhost:3000")
	http.ListenAndServe(":3000", r)
}