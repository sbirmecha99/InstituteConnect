package routes
import(
	"instituteconnect/handlers"
	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App) {
	group := app.Group("/api/users")
	group.Get("/", handlers.GetUsers)
	group.Get("/:id", handlers.GetUser)
	group.Post("/", handlers.CreateUser)
	group.Put("/:id", handlers.UpdateUser)
	group.Delete("/:id", handlers.DeleteUser)
}