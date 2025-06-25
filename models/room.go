package models

import (
	"time"
)
type RoomType string
const (
	LectureHall  RoomType = "lecture"
	Lab RoomType = "lab"
	SeminarRoom RoomType = "seminar"
)
type BuildingName string
const(
	Nab BuildingName = "NAB"
	Lg BuildingName = "LG"
)
type Room struct {
    ID         uint      `gorm:"primaryKey" json:"id"`
    RoomNo string    `gorm:"uniqueIndex;not null" json:"room_no"` 
    Building   BuildingName    `gorm:"type varchar(10);not null" json:"building"`           
    Type       RoomType    `gorm:"type:varchar(20);default:'lecture'" json:"type"`           
    CreatedAt  time.Time
    UpdatedAt  time.Time
}
