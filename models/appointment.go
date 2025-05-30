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
    StudentID  uint
    FacultyID  uint
    Status     AppointmentStatus `gorm:"default:pending"`
    TimeSlot   time.Time

    Student    User `gorm:"foreignKey:StudentID"`
    Faculty    User `gorm:"foreignKey:FacultyID"`
}
