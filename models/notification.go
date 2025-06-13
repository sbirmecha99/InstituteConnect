package models

import "gorm.io/gorm"

type Notification struct {
    gorm.Model
    Title        string `json:"title"`
    Description  string `json:"description"`
    PostedByID   uint   `json:"posted_by_id"`
    PostedBy     User   `gorm:"foreignKey:PostedByID"`
     
    PostedFor    string `json:"posted_for"`    
    IsGlobal     bool   `json:"is_global"`
}

