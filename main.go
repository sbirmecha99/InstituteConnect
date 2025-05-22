package main

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/routes"


	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
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

	app := fiber.New()

	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))

}
