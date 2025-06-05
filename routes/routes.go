package routes

import (
	"instituteconnect/controllers"
	"instituteconnect/middleware"
	"instituteconnect/models"
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

}

func SetupRoutes(app *fiber.App) {

	//serve login page
	 app.Get("/", func(c *fiber.Ctx) error {
        return c.Render("login", fiber.Map{})
    })

	app.Get("/auth/google", controllers.GoogleLogin)
	app.Get("/auth/google/callback", controllers.GoogleCallback)

    //middleware protection
app.Get("/dashboard", middleware.JWTProtected(), func(c *fiber.Ctx) error {
    userInterface := c.Locals("user")
user, ok := userInterface.(models.User)
if !ok {
    return c.Status(fiber.StatusUnauthorized).SendString("User not found or invalid type")
}

    switch user.Role {
    case "SuperAdmin":
        return c.Render("dashboard/dean", fiber.Map{"User": user})
    case "Admin":
        return c.Render("dashboard/hod", fiber.Map{"User": user})
    case "Prof":
        return c.Render("dashboard/professor", fiber.Map{"User": user})
    case "Student":
        return c.Render("dashboard/student", fiber.Map{"User": user})
    default:
        return c.Status(fiber.StatusForbidden).SendString("Invalid role")
    }
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

	//protected route
	app.Get("/dashboard", controllers.Protected)*/

}
