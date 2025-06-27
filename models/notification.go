package models

import "time"

type Notification struct {
	ID         uint      `gorm:"primaryKey"`
	Message    string    `json:"message"`
	CreatedAt  time.Time
	Semester   *int      `json:"semester"`  
	Department *string   `json:"department"` 
	CreatedBy  uint      `json:"created_by"` 
    Global bool `json:"global"`
	Poster User  `gorm:"foreignKey:CreatedBy" json:"poster"`
}


