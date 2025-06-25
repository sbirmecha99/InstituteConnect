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
	app.Post("/api/logout",controllers.Logout)

	app.Post("/api/appointments", middleware.JWTProtected(),handlers.RequestAppointment)
	app.Get("/api/student/appointments",middleware.JWTProtected(),handlers.GetAppointmentsForStudent)
	app.Get("/api/prof/appointments",middleware.JWTProtected(),handlers.GetAppointmentsForProf)
	app.Put("/api/appointments/:id",middleware.JWTProtected(),handlers.UpdateAppointmentStatus)
	app.Get("/api/prof/appointments/count",middleware.JWTProtected(),handlers.GetPendingAppointmentCount)

	app.Post("/api/rooms/bulk",middleware.JWTProtected(),handlers.BulkCreateRooms)
	app.Post("/api/create/timeslot",middleware.JWTProtected(),handlers.CreateTimeSlot)
	app.Get("/api/faculty/timetable",middleware.JWTProtected(),handlers.GetFacultyTimetable)
	app.Get("/api/student/timetable",middleware.JWTProtected(),handlers.GetStudentTimetable)


}
