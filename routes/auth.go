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

	app.Get("/dashboard/student", middleware.JWTProtected(), func(c *fiber.Ctx) error {
	return c.Render("student_dashboard", fiber.Map{})
})

app.Get("/dashboard/professor", middleware.JWTProtected(), func(c *fiber.Ctx) error {
	return c.Render("professor_dashboard", fiber.Map{})
})

app.Get("/dashboard/hod", middleware.JWTProtected(), func(c *fiber.Ctx) error {
	return c.Render("hod_dashboard", fiber.Map{})
})

app.Get("/dashboard/admin", middleware.JWTProtected(), func(c *fiber.Ctx) error {
	return c.Render("dean_dashboard", fiber.Map{})
})


//signup.html
app.Get("/signup",func(c *fiber.Ctx)error{
	return c.Render("signup",fiber.Map{})
})

app.Post("/auth/register",controllers.Register)

app.Post("/auth/login",controllers.EmailPasswordLogin)

	/*//dashboard route after login
	 app.Get("/dashboard", func(c *fiber.Ctx) error {
        return c.Render("dashboard", fiber.Map{})
    })	

	// Example protected route
	app.Get("/dashboard", controllers.Protected)*/


}

