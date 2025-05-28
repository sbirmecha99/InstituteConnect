package middleware

import (
	"github.com/gofiber/fiber/v2"
	"instituteconnect/utils"
	"instituteconnect/config"
	"instituteconnect/models"

)

func JWTProtected()fiber.Handler{
	return func(c *fiber.Ctx)error{
		token := c.Cookies("token")
		if token == ""{
			return c.Redirect("/")
		}

		claims,err := utils.ValidateJWT(token)
		if err!=nil{
			return c.Redirect("/")
		}
		
		email,ok:=claims["email"].(string)
		if !ok{
			return c.Redirect("/")
		}

		var user models.User
		result := config.DB.Where("email = ?",email).First(&user)
		if result.Error != nil || result.RowsAffected==0{
			return c.Redirect("/")
		}

		c.Locals("user",user)
		return c.Next()


	}
}