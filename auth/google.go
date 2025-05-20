package auth

import (
	"os"

	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/google"
)

func Init() {
	goth.UseProviders(
		google.New(
			os.Getenv("google_clientID"),
			os.Getenv("google_clientSECRET"),
			"http://localhost:3000/auth/google/callback",
			"email", "profile",
		),
	)
}
