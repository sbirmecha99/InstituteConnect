package models
import (
	"gorm.io/gorm"
	"time"
)

type EmailVerification struct {
    gorm.Model
    UserID    uint
    Token     string `gorm:"uniqueIndex;not null"`
    ExpiresAt time.Time
}
