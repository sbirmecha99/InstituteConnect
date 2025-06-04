package models

import "gorm.io/gorm"

type Notification struct {
    gorm.Model
    Title  string `json:"title"`
    Description      string `json:"description"`
    PostedByID  uint `json:"posted_by_id"`
    ClassName   string `json:"class_name"` //for specifying class (optional)
    
}
