package main

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"instituteconnect/routes"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading env file")
	}

	config.ConnectDatabase()

	error1 := config.DB.AutoMigrate(
		&models.User{},
		&models.Room{},
		&models.RoomSchedule{},
		&models.Appointment{},
		&models.Notification{},
	)

	if error1 != nil {
		log.Fatal("automigration failure: ", error1)
	}
	log.Println("migration successful!")


	// Set up HTML templates
	engine := html.New("./templates", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})
	//user routes
	routes.UserRoutes(app)
	routes.RoomRoutes(app)
	
	// Serve static files (like CSS)
	app.Static("/static", "./static")

	// Serve login.html at root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("login", fiber.Map{})
	})
	log.Println("[debug]setting up routes")

	routes.SetupRoutes(app)

	app.Get("/dashboard", func(c *fiber.Ctx) error {
		return c.Render("dashboard", fiber.Map{})
	})

	log.Println("[debug]starting server on 3000")

	err = (app.Listen(":3000"))
	if err != nil {
		log.Println("server failed to start: ", err)
	}

}
