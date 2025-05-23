package middleware

import (
	"github.com/gofiber/fiber/v2"
	"instituteconnect/utils"

)

func JWTProtected()fiber.Handler{
	return func(c *fiber.Ctx)error{
		token := c.Cookies("token")
		if token == ""{
			return c.Redirect("/")
		}

		_,err := utils.ValidateJWT(token)
		if err!=nil{
			return c.Redirect("/")
		}
		return c.Next()

	}
}