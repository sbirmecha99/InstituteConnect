package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"

	"github.com/gofiber/fiber/v2"
)

//all userrs
func GetUsers(c *fiber.Ctx) error {
	var users []models.User

	user := c.Locals("user").(models.User)
	if user.Role !="SuperAdmin"&&user.Role!="Admin"{
		return c.Status(fiber.StatusForbidden).SendString("Only admin can access user list")
	}

	if err := config.DB.Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "can't get users"})
	}
	return c.JSON(users)
}

//get user by ID
func GetUser(c *fiber.Ctx)error{
	id:=c.Params("id")
	
	user := c.Locals("user").(models.User)
	if user.Role !="SuperAdmin"{
		return c.Status(fiber.StatusForbidden).SendString("Only admin can access user list")
	}
	if err:=config.DB.First(&user,id).Error;err!=nil{
		return c.Status(404).JSON(fiber.Map{"error":"user not found"})
	}
	return c.JSON(user)
}
//creatinf users
func CreateUser(c *fiber.Ctx)error{
	user:= new(models.User)
	if err:=c.BodyParser(user); err!=nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error":"cannot parse JSON"})
	}
	if err:= config.DB.Create(&user).Error;err!=nil{
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error":"could not create user"})
	}
	return c.Status(fiber.StatusCreated).JSON(user)
}

//updating users by ID

func UpdateUser(c *fiber.Ctx)error{
	id:=c.Params("id")
	user:=new(models.User)
	if err:=c.BodyParser(user);err!=nil{
		return c.Status(400).JSON(fiber.Map{"error":"invalid request"})
	}
	var existing models.User
	if err:=config.DB.First(&existing,id).Error;err!=nil{
		return c.Status(404).JSON(fiber.Map{"error":"user not found"})
	}
	user.ID=existing.ID
	if err:=config.DB.Save(&user).Error;err!=nil{
		return c.Status(500).JSON(fiber.Map{"error":"unable to update teh user"})
	}
	return c.JSON(user)
}

//deletion by ID
func DeleteUser(c *fiber.Ctx)error{
	id:= c.Params("id")

	user := c.Locals("user").(models.User)
	if user.Role !="SuperAdmin"{
		return c.Status(fiber.StatusForbidden).SendString("Only admin can access user list")
	}
	if err:= config.DB.Delete(&models.User{},id).Error;err!=nil{
		return c.Status(500).JSON(fiber.Map{"error":"could not delete user"})
	}
	return c.SendStatus(204)
}
