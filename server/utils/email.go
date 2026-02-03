package utils

import (
	"bytes"
	"html/template"
	"log"
	"net/smtp"
	"os"
)

type EmailData struct {
    Name      string
    VerifyURL string
}

func SendVerificationEmail(to string, data EmailData) error {
    from := os.Getenv("SMTP_EMAIL")
    password := os.Getenv("SMTP_PASSWORD")
    host := os.Getenv("SMTP_HOST")
    port := os.Getenv("SMTP_PORT")

    // 1. Properly handle template loading to avoid Nil Pointer Panic
    tmpl, err := template.ParseFiles("templates/emailverify.html")
    if err != nil {
        log.Printf("CRITICAL: Template file not found at templates/verify_email.html: %v", err)
        return err
    }

    var body bytes.Buffer
    if err := tmpl.Execute(&body, data); err != nil {
        return err
    }

    subject := "Subject: Verify Your Email - Institute Connect\n"
    mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
    msg := []byte(subject + mime + body.String())

    auth := smtp.PlainAuth("", from, password, host)

    // 2. Dial and Send
    err = smtp.SendMail(host+":"+port, auth, from, []string{to}, msg)
    if err != nil {
        log.Printf("SMTP Error: %v", err)
        return err
    }
    
    log.Println("Email sent successfully to:", to)
    return nil
}