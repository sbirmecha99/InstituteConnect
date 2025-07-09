package handlers

import (
	"instituteconnect/config"
	"instituteconnect/models"
	"golang.org/x/crypto/bcrypt"

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
func CreateUser(c *fiber.Ctx) error {
	user:=c.Locals("user").(models.User)
	if user.Role != "superadmin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only superadmins can create users",
		})
	}

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not hash password",
		})
	}
	user.Password = string(hashed)

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}


//updating users by ID
func UpdateUser(c *fiber.Ctx) error {
    id := c.Params("id")
    var existing models.User

    if err := config.DB.First(&existing, id).Error; err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "user not found"})
    }

    var input struct {
        Name       string  `json:"name"`
        Email      string  `json:"email"`
        Department *string `json:"department"`
        Semester   *int    `json:"semester"`
        Bio        *string `json:"bio"`
    }
    if err := c.BodyParser(&input); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
    }

    updates := map[string]interface{}{}
    if input.Name != "" {
        updates["name"] = input.Name
    }
    if input.Email != "" {
        updates["email"] = input.Email
    }
    if input.Department != nil {
        updates["department"] = input.Department
    }
    if input.Semester != nil {
        updates["semester"] = input.Semester
    }
    if input.Bio != nil {
        updates["bio"] = input.Bio
    }

    if err := config.DB.Model(&existing).Updates(updates).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "unable to update user"})
    }
    return c.JSON(existing)
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
func GetProfessors(c *fiber.Ctx) error {
	var professors []models.User
	if err := config.DB.Where("role = ?", "Prof").Find(&professors).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch professors",
		})
	}

	//relevant data
	safeList := make([]map[string]interface{}, 0, len(professors))
	for _, p := range professors {
		safeList = append(safeList, map[string]interface{}{
			"id":         p.ID,
			"name":       p.Name,
			"email":      p.Email,
			"department": p.Department,
		})
	}

	return c.JSON(safeList)
}
