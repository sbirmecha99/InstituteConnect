package routes
import(
	"instituteconnect/handlers"
	"github.com/gofiber/fiber/v2"
	"instituteconnect/middleware"
)

func UserRoutes(app *fiber.App) {
	group := app.Group("/api/users")

	group.Get("/", middleware.JWTProtected(),handlers.GetUsers)
	group.Get("/:id",middleware.JWTProtected(), handlers.GetUser)
	group.Post("/", handlers.CreateUser)
	group.Put("/:id", middleware.JWTProtected(),handlers.UpdateUser)
	group.Delete("/:id",middleware.JWTProtected(), handlers.DeleteUser)
}
func RoomRoutes(app *fiber.App) {
	group := app.Group("/api/rooms")

	group.Get("/",handlers.GetRooms)
	group.Get("/:id",handlers.GetRoom)
	group.Post("/", middleware.JWTProtected(),handlers.CreateRoom)
	group.Put("/:id",middleware.JWTProtected(), handlers.UpdateRoom)
	group.Delete("/:id",middleware.JWTProtected(), handlers.DeleteRoom)
}