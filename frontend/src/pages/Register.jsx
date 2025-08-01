import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import { Snackbar, Alert } from "@mui/material";
import Header from "../components/Header";
import BASE_URL from "../api/config";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    console.log(email, password);
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("Registered successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => navigate("/login"), 1500); // wait before redirect
      } else {
        setSnackbarMessage(data?.error || "Registration failed!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Something went wrong! Please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Header />

      <div className="auth-page">
        <div className="main-container">
          <div className="login-container">
            <h2 className="form-title">InstituteConnect</h2>
            <form className="login-form" onSubmit={handleRegister}>
              <InputField
                type="text"
                placeholder="Full Name"
                icon="person"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
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
              <InputField
                type="password"
                placeholder="Confirm Password"
                icon="lock"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="register-button">Register</button>
            </form>
            <p className="signup-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <p className="separator">
              <span>or</span>
            </p>
            <SocialLogin />
          </div>
          <div className="image-section-register"></div>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Register;
