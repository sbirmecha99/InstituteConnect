package models

import "gorm.io/gorm"

type Room struct {
    gorm.Model
    RoomNo    string  
    Purpose   string
    AssignedToID uint 
    AssignedTo   User   
}
