package routes

import (
	"instituteconnect/handlers"
	"instituteconnect/middleware"
	"log"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App) {
	group := app.Group("/api/users")
	log.Println("connecting user api")

	group.Get("/", middleware.JWTProtected(),handlers.GetUsers)
	group.Get("/:id", handlers.GetUser)
	group.Post("/", handlers.CreateUser)
	group.Put("/:id",handlers.UpdateUser)
	group.Delete("/:id", handlers.DeleteUser)
}
func RoomRoutes(app *fiber.App) {
	group := app.Group("/api/rooms")
	log.Println("connecting room api")

	group.Get("/",handlers.GetRooms)
	group.Get("/:id",handlers.GetRoom)
	group.Post("/", middleware.JWTProtected(),handlers.CreateRoom)
	group.Put("/:id",middleware.JWTProtected(), handlers.UpdateRoom)
	group.Delete("/:id",middleware.JWTProtected(), handlers.DeleteRoom)
}