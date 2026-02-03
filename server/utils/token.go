package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateSecureToken() string {
	bytes := make([]byte, 32) // 256-bit
	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(bytes)
}
