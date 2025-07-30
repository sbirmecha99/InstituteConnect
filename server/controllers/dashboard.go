package controllers

import(
	"instituteconnect/models"
	"github.com/gofiber/fiber/v2"
)

func RenderDashboard(c *fiber.Ctx,user models.User)error{
	viewname:=""

	switch user.Role{
	case models.Student:
		viewname="/dashboard/student"
	case models.Prof:
		viewname = "dashboard/professor"
	case models.Admin:
		viewname = "dashboard/hod"
	case models.SuperAdmin:
		viewname = "dashboard/admin"
	default:
		return c.Status(fiber.StatusForbidden).SendString("Unauthorized role")
	}

	return c.Render(viewname, fiber.Map{
		"Title": "Dashboard",
		"Name":  user.Name,
	}, "layouts/dashboard_layout")

	}
