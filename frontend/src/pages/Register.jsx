import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const handleRegister=async(e)=>{
    e.preventDefault();
    if(password!==confirmPassword){
      alert("Passwords do not match!");
      return;
    }
    const response = await fetch("http://localhost:3000/api/register", {
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
    if (response.ok){
      alert("Registered successfully!");
      navigate("/login");
    }else{
      alert("Registration failed");
    }
  };

  return (
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

        <button className="login-button">Register</button>
      </form>
      <p className="signup-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
