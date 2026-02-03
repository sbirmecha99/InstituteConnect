package models

import "gorm.io/gorm"

type Role string

const(
    SuperAdmin Role = "SuperAdmin"
    Admin      Role = "Admin"
    Prof       Role = "Prof"
    Student    Role = "Student"
)

type User struct{
    gorm.Model
    Name     string `gorm:"not null" json:"name"`
    Email    string `gorm:"uniqueIndex;not null" json:"email"`
    Password string `gorm:""`
    Role     Role   `gorm:"not null" json:"role"`
    GoogleID string `gorm:"default:null"`
    IsVerified bool `gorm:"default:false" json:"isVerified"`

    ProfilePicture string `json:"profile_picture"`
    Program string `json:"program"`
    Department string `json:"department"`
    Semester int `json:"semester"`

}

