package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
    sslmode := os.Getenv("DB_SSLMODE")
    if sslmode == "" {
        sslmode = "require" 
    }
    
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_PORT"),
        sslmode,
    )

    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("GORM open failed: %v", err)
    }

    sqlDB, err := DB.DB()
    if err != nil {
        log.Fatalf("failed to get underlying sql.DB: %v", err)
    }

    if err := sqlDB.Ping(); err != nil {
        log.Fatalf("Handshake failed! Database unreachable: %v", err)
    }

    log.Println("Connected to NeonDB")
}
