package main

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/routes"
	"os"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {

if os.Getenv("RENDER") == "" {
	if err := godotenv.Overload(); err != nil {
    log.Println("No .env file found")
}
}


	config.ConnectDatabase()

	error1 := config.DB.AutoMigrate(
		&models.User{},
		&models.Room{},
		&models.Appointment{},
		&models.Notification{},
		&models.TimeSlot{},
		&models.EmailVerification{},
	)

	if error1 != nil {
		log.Fatal("automigration failure: ", error1)
	}
	log.Println("migration successful!")



	app := fiber.New(fiber.Config{
		BodyLimit: 10*1024*1024,
	})

	app.Static("/uploads", "./uploads")	

	//cors setup for react
	app.Use(cors.New(cors.Config{
	AllowOrigins:"https://institute-connect-shreya-birmechas-projects.vercel.app, http://localhost:5173, http://localhost:3000",
	AllowCredentials: true,
	AllowHeaders: "Origin,Accept,Content-Type,Authorization",
	AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
  }))

	//user routes
	routes.UserRoutes(app)
	routes.UsersRoutes(app)
	routes.RoomRoutes(app)

	log.Println("[debug]starting server on 3000")

	if err := app.Listen(":3000"); err != nil {
	log.Println("server failed to start: ", err)
}

}
