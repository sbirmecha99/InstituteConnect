package routes

import (
	"instituteconnect/controllers"
	"instituteconnect/handlers"
	"instituteconnect/middleware"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App){
    api:= app.Group("/api")

    api.Post("/register",controllers.Register)
    app.Post("/api/login",controllers.EmailPasswordLogin)

    app.Get("/auth/google",controllers.GoogleLogin)
    app.Get("/auth/google/callback",controllers.GoogleCallback)

    api.Get("/me",controllers.Me)
    app.Get("/api/auth/verify", controllers.AuthVerify)
	app.Put("/api/profile",middleware.JWTProtected(),controllers.UpdateProfile)
	app.Get("/api/professors",middleware.JWTProtected(), handlers.GetProfessors)
	app.Post("/api/appointments", middleware.JWTProtected(),handlers.RequestAppointment)



}

func SetupRoutes(app *fiber.App) {

	//serve login page
	 app.Get("/", func(c *fiber.Ctx) error {
        return c.Render("login", fiber.Map{})
    })

	app.Get("/auth/google", controllers.GoogleLogin)
	app.Get("/auth/google/callback", controllers.GoogleCallback)


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

	//protected route
	app.Get("/dashboard", controllers.Protected)*/

}
