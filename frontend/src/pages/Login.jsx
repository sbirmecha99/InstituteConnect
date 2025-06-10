import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";




function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
            "Content-Type":"application/json",
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

        const role = decoded.role;
        console.log("User role:", role);
        

        //redirction based on roles
        switch (role) {
          case "SuperAdmin":
            navigate("/dashboard/dean");
            break;
            case "Admin":
              navigate("/dashboard/hod")
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
      setError(err.response?.data || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };
  return (
    <div className="auth-page">
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
  );
}

export default Login;
