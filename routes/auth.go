package routes

import (
	"instituteconnect/controllers"
	"instituteconnect/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

	//serve login page
	 app.Get("/", func(c *fiber.Ctx) error {
        return c.Render("login", fiber.Map{})
    })

	app.Get("/auth/google", controllers.GoogleLogin)
	app.Get("/auth/google/callback", controllers.GoogleCallback)

	app.Get("/dashboard", middleware.JWTProtected(), func(c *fiber.Ctx) error {
    return c.Render("dashboard", fiber.Map{})
})
	//dashboard route after login
	 app.Get("/dashboard", func(c *fiber.Ctx) error {
        return c.Render("dashboard", fiber.Map{})
    })	

	// Example protected route
	app.Get("/dashboard", controllers.Protected)


}

