package routes

import (
	"instituteconnect/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/auth/google", controllers.GoogleLogin)
	app.Get("/auth/google/callback", controllers.GoogleCallback)

	// Example protected route
	app.Get("/dashboard", controllers.Protected)
}

