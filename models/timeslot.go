package models

import "time"

type WeekDay string

const (
	Monday    WeekDay = "Monday"
	Tuesday   WeekDay = "Tuesday"
	Wednesday WeekDay = "Wednesday"
	Thursday  WeekDay = "Thursday"
	Friday    WeekDay = "Friday"
	)

type TimeSlot struct {
	ID         uint      `gorm:"primaryKey"`
	Day        WeekDay   `gorm:"type:varchar(10);not null" json:"day"` 
	StartTime  time.Time    `gorm:"not null" json:"start_time"` 
	EndTime    time.Time    `gorm:"not null" json:"end_time"` 
	// Relationships
	RoomID     uint      `json:"room_id"`
	Room       Room      `gorm:"foreignKey:RoomID"`

	CourseCode string    `gorm:"type:varchar(20)" json:"course_code"`
	Semester int `gorm:"not null"`
	Department string `gorm:"not null"`

	FacultyID  uint      `json:"faculty_id"` 
	Faculty User                        
}
