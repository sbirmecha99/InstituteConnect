package utils

import "strings"

func DetermineRole(email string)string{
	email=strings.ToLower(email)

	switch{
	case strings.Contains(email,"hod"):
		return "Admin"
	case strings.Contains(email,"dean"):
		return "SuperAdmin"
	case strings.Contains(email,".bt")||strings.Contains(email,".ce")||strings.Contains(email,".ch")||strings.Contains(email,".cse")||
	strings.Contains(email,".ece")||strings.Contains(email,".ee")||strings.Contains(email,".ees")||strings.Contains(email,".hu")||
	strings.Contains(email,".maths")||strings.Contains(email,".me")||strings.Contains(email,".mme")||
	strings.Contains(email,".dms")||strings.Contains(email,"ce")||strings.Contains(email,".phy"):
	return "Prof"
	default:
		return "Student"
	}
	
}

func DashboardRedirect(role string) string {
    return "/dashboard"
}
