package models

import "gorm.io/gorm"

type Role string

const (
    SuperAdmin Role = "superadmin"
    Admin      Role = "admin"
    Prof       Role = "prof"
    Student    Role = "student"
)

type User struct {
    gorm.Model
    Name     string `gorm:"not null"`
    Email    string `gorm:"uniqueIndex;not null"`
    Role     Role   `gorm:"not null"`
    GoogleID string `gorm:"uniqueIndex"`
    Rooms    []Room `gorm:"foreignKey:AssignedToID"`
}
