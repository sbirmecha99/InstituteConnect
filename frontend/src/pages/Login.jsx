import React, { useState } from "react";
import { useNavigate, Link, json } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import Header from "../components/Header";
import { Snackbar, Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    //DEBUG
    console.log("Email being sent:", email);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Login success:", res.data);

      //saving token if present
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);

        //decoding to get user role
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        const userRes = await axios.get("http://localhost:3000/api/me", {
          withCredentials: true,
        });

        const fullUser = userRes.data.user;
        localStorage.setItem("user", JSON.stringify(fullUser));

        const role = fullUser.role;
        console.log("User role:", role);

        //redirction based on roles
        switch (role) {
          case "SuperAdmin":
            window.location.href = "/dashboard/dean";
            break;
          case "Admin":
            window.location.href = "/dashboard/hod";
            break;
          case "Prof":
            window.location.href = "/dashboard/professor";
            break;
          case "Student":
            window.location.href = "/dashboard/student";
            break;
          default:
            window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      console.error("Login failed:", err.response);
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
              <a href="#" className="forgot-pass-link">
                Forgot Password?
              </a>
              <button className="login-button">Log In</button>
            </form>
            <p className="signup-text">
              Don&apos;t have an account? <a href="/register">Register</a>{" "}
            </p>
            <p className="separator">
              <span>or</span>{" "}
            </p>
            <SocialLogin />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
      ;
    </>
  );
}

export default Login;
