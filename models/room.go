package models

import "gorm.io/gorm"

type Room struct {
	gorm.Model

	RoomNo  string `gorm:"unique;not null"`
}

