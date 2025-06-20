package models

import "gorm.io/gorm"

type Role string

const(
    SuperAdmin Role = "superadmin"
    Admin      Role = "admin"
    Prof       Role = "prof"
    Student    Role = "student"
)

type User struct{
    gorm.Model
    Name     string `gorm:"not null" json:"name"`
    Email    string `gorm:"uniqueIndex;not null" json:"email"`
    Password string `gorm:""`
    Role     Role   `gorm:"not null" json:"role"`
    GoogleID string `gorm:"default:null"`

    ProfilePicture string `gorm:"default:'/uploads/guest_user.jpeg'" json:"profile_picture"`
    Program string `json:"program"`
    Department string `json:"department"`
    Semester int `json:"semester"`

}

