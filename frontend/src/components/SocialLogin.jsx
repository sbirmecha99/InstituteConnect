import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import BASE_URL from "../api/config";

const SocialLogin = () => {
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // "success" or "error"

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      const res = await axios.post(
        `${BASE_URL}/api/auth/google`,
        { credential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);

        const userRes = await axios.get(`${BASE_URL}/api/me`, {
          withCredentials: true,
        });

        const fullUser = userRes.data.user;
        localStorage.setItem("user", JSON.stringify(fullUser));

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
        showSnackbar("Google login successful!", "success");
      }
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Google login failed.";
      showSnackbar(errorMessage, "error");
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => showSnackbar("Google login failed.")}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
  );
};

export default SocialLogin;
