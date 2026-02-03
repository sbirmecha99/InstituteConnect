import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import Header from "../components/Header";
import { Snackbar, Alert } from "@mui/material";
import BASE_URL from "../api/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // 1. Handle Verification Redirects on Component Mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get("verified");

    if (verified === "true") {
      setSnackbarMessage("Email verified successfully! You can now log in.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (verified === "expired") {
      setSnackbarMessage("Verification link expired. Please register again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (verified === "invalid") {
      setSnackbarMessage("Invalid verification link.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [location]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);

        // Decoding just to log, but using the /me endpoint for state is safer
        const decoded = jwtDecode(token);
        console.log("User Claims:", decoded);

        // Fetch full profile info
        const userRes = await axios.get(`${BASE_URL}/api/me`, {
          withCredentials: true,
        });

        const fullUser = userRes.data.user;
        localStorage.setItem("user", JSON.stringify(fullUser));

        // Redirect based on role
        const role = fullUser.role;
        switch (role) {
          case "SuperAdmin":
            navigate("/dashboard/dean");
            break;
          case "Admin":
            navigate("/dashboard/hod");
            break;
          case "Prof":
            navigate("/dashboard/professor");
            break;
          case "Student":
            navigate("/dashboard/student");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login Error:", err.response);
      // This will catch the 403 "Please verify your email" from your Go backend
      setSnackbarMessage(err.response?.data?.error || "Login Failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="main-container">
          <div className="image-section-login"></div>
          <div className="login-container">
            <h2 className="form-title">Login</h2>
            <form className="login-form" onSubmit={handleEmailLogin}>
              <InputField
                type="email"
                placeholder="Institute Email address"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                type="password"
                placeholder="Password"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link
                to="/forgot-password"
                size="small"
                className="forgot-pass-link"
              >
                Forgot Password?
              </Link>
              <button type="submit" className="login-button">
                Log In
              </button>
            </form>
            <p className="signup-text">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
            <p className="separator">
              <span>or</span>
            </p>
            <SocialLogin />
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
