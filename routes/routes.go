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

    app.Get("/api/me",middleware.JWTProtected(),controllers.Me)
    app.Get("/api/auth/verify", controllers.AuthVerify)
	app.Put("/api/profile",middleware.JWTProtected(),controllers.UpdateProfile)
	app.Get("/api/professors",middleware.JWTProtected(), handlers.GetProfessors)
	app.Post("/api/logout",controllers.Logout)

	app.Put("/api/users/:id", middleware.JWTProtected(), handlers.UpdateUser) 
    app.Delete("/api/users/:id", middleware.JWTProtected(), handlers.DeleteUser) 
    app.Post("/api/users", middleware.JWTProtected(), handlers.CreateUser)       


	app.Post("/api/appointments", middleware.JWTProtected(),handlers.RequestAppointment)
	app.Get("/api/student/appointments",middleware.JWTProtected(),handlers.GetAppointmentsForStudent)
	app.Get("/api/prof/appointments",middleware.JWTProtected(),handlers.GetAppointmentsForProf)
	app.Put("/api/appointments/:id",middleware.JWTProtected(),handlers.UpdateAppointmentStatus)
	app.Get("/api/prof/appointments/count",middleware.JWTProtected(),handlers.GetPendingAppointmentCount)

	app.Post("/api/rooms/bulk",middleware.JWTProtected(),handlers.BulkCreateRooms)
	app.Post("/api/create/timeslot",middleware.JWTProtected(),handlers.CreateTimeSlot)
	app.Get("/api/faculty/timetable",middleware.JWTProtected(),handlers.GetFacultyTimetable)
	app.Get("/api/student/timetable",middleware.JWTProtected(),handlers.GetStudentTimetable)
	app.Put("/api/timeslot/:id",middleware.JWTProtected(), handlers.UpdateTimeSlot)

	app.Post("/api/notifications",middleware.JWTProtected(),handlers.CreateNotification)
	app.Get("/api/get/notifications",middleware.JWTProtected(),handlers.GetNotifications)
	app.Get("/api/prof/notifications",middleware.JWTProtected(),handlers.GetProfNotifications)
	app.Get("/api/all/notifications",middleware.JWTProtected(),handlers.GetAllNotifications)
	app.Delete("/api/notifications/:id",middleware.JWTProtected(),handlers.DeleteNotification)
	app.Put("/api/editnotifications/:id",middleware.JWTProtected(),handlers.EditNotification)

}
