package main

import (
	"os"
    "database/sql"
    "fmt"
    _ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
    const (
        host     = "localhost"
        port     = 5432
        user     = "postgres"
        dbname   = "instituteconnect"
    )

	password := os.Getenv("DB_pw")
	if password == "" {
        fmt.Println("DB password is not set!")
        return
    }

    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
        "password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)

    var err error
    DB, err = sql.Open("postgres", psqlInfo)
    if err != nil {
        panic(err)
    }

    err = DB.Ping()
    if err != nil {
        panic(err)
    }

    fmt.Println("connected to the database!")
}
