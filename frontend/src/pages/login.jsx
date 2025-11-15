import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      // Get users from localStorage
      const usersJson = localStorage.getItem("users");
      let users = [];
      
      if (usersJson) {
        try {
          users = JSON.parse(usersJson);
          // Ensure it's an array
          if (!Array.isArray(users)) {
            users = [];
          }
        } catch (parseErr) {
          console.error("Error parsing users:", parseErr);
          users = [];
        }
      }

      // Find user by email
      const user = users.find((u) => u.email === email);

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      // Decode password (base64)
      let decodedPassword;
      try {
        decodedPassword = atob(user.password);
      } catch (decodeErr) {
        console.error("Error decoding password:", decodeErr);
        setError("Invalid email or password");
        return;
      }

      // Check password
      if (decodedPassword !== password) {
        setError("Invalid email or password");
        return;
      }

      // Store authenticated user
      localStorage.setItem("authUser", JSON.stringify({ name: user.name, email: user.email }));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <style>{css}</style>

      <div className="card">
        <div className="left">
          <div className="brand">
            <h1>Safe</h1>
            <h1>Journey</h1>
          </div>

          <div className="notch">
            <button className="tab active">LOGIN</button>
            <button className="tab" onClick={() => navigate("/signup")}>
              SIGN UP
            </button>
          </div>
        </div>

        <div className="right">
          <h2>LOGIN</h2>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputRow">
              <span className="icon">✉️</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="inputRow">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="showBtn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="primary">LOGIN</button>

            <p className="goSignup" onClick={() => navigate("/signup")}>
              Don't have an account? Sign Up
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const css = `
/* FULL CSS (same theme as Signup) */
.login-page{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#7828BC; /* UPDATED COLOR */
  padding:20px;
  font-family:"Poppins",sans-serif;
}
.card{
  display:flex;
  width:900px;
  height:560px;
  border-radius:20px;
  overflow:hidden;
  background:white;
  box-shadow:0 12px 40px rgba(0,0,0,0.2);
}

.left{
  width:40%;
  background:linear-gradient(135deg,#A45EEA,#7C2ED3);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  position:relative;
  color:white;
}

.brand h1{
  margin:0;
  font-size:40px;
}

.notch{
  position:absolute;
  right:-70px;
  width:160px;
  height:150px;
  background:white;
  border-radius:150px 0 0 150px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}

.tab{
  border:none;
  background:none;
  font-size:16px;
  font-weight:700;
  padding:10px;
  cursor:pointer;
}

.tab.active{
  color:white;
  border-bottom:2px solid white;
}

.right{
  width:60%;
  padding:40px 60px;
}

.form{
  display:flex;
  flex-direction:column;
  gap:15px;
}

.inputRow{
  display:flex;
  align-items:center;
  border:1px solid #ddd;
  padding:10px;
  border-radius:10px;
}

.inputRow input{
  flex:1;
  border:none;
  outline:none;
}

.icon{
  margin-right:10px;
}

.showBtn{
  background:none;
  border:none;
  color:#ff758c;
  cursor:pointer;
}

.error{
  color:red;
  padding:8px;
  background:#ffd6d6;
  border-radius:8px;
}

.primary{
  background:linear-gradient(135deg,#A45EEA, #7C2ED3);
  color:white;
  border:none;
  padding:12px;
  border-radius:30px;
  cursor:pointer;
  font-weight:700;
}

.goSignup{
  text-align:center;
  cursor:pointer;
  color:black;
}
`;
