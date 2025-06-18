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
	app.Post("/api/logout",controllers.Logout)

}
