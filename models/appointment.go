package models

import (
	"time"

	"gorm.io/gorm"
)

type AppointmentStatus string

const (
	Pending  AppointmentStatus = "pending"
	Accepted AppointmentStatus = "accepted"
	Declined AppointmentStatus = "declined"
)

type Appointment struct {
	gorm.Model

	StudentID uint              `json:"student_id" gorm:"not null;index"` // Indexed for faster lookup
	FacultyID uint              `json:"faculty_id" gorm:"not null;index"`
	Status    AppointmentStatus `json:"status" gorm:"type:enum('pending','accepted','declined');default:'pending'"`

	TimeSlot time.Time `json:"time_slot"`

	Student User `gorm:"foreignKey:StudentID" json:"student"`
	Faculty User `gorm:"foreignKey:FacultyID" json:"faculty"`
}
