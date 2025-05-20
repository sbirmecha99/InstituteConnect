package models

import "gorm.io/gorm"

type Notification struct {
    gorm.Model
    SenderID  uint
    Role      Role
    Audience  string 
    Message   string

    Sender    User `gorm:"foreignKey:SenderID"`
}
