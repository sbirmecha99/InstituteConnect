package models

import "gorm.io/gorm"

type RoomSchedule struct {
	gorm.Model
	RoomID       uint
	Room         Room
	FacultyID    uint
	Faculty      User `gorm:"foreignKey:FacultyID"`
	DayOfWeek    string
	StartTime    string
	EndTime      string
	Purpose      string
	IsExtraClass bool
}
