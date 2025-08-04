package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/google/uuid"
)

func UploadToCloudinary(ctx context.Context, file *multipart.FileHeader) (string, error) {
	if os.Getenv("CLOUDINARY_CLOUD_NAME") == "" || os.Getenv("CLOUDINARY_API_KEY") == "" || os.Getenv("CLOUDINARY_API_SECRET") == "" {
		return "", fmt.Errorf("missing Cloudinary credentials")
	}

	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return "", err
	}

	f, err := file.Open()
	if err != nil {
		return "", err
	}
	defer f.Close()

	publicID := "pfp_" + uuid.New().String()

	uploadResult, err := cld.Upload.Upload(ctx, f, uploader.UploadParams{
		PublicID: publicID,
		Folder:   "uploads",
	})
	if err != nil {
		return "", err
	}
	fmt.Println("Uploaded image URL:", uploadResult.SecureURL)

	return uploadResult.SecureURL, nil
}