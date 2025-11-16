import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    city: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.[A-Z])(?=.\d)(?=.*[@#$])[A-Za-z\d@#$]{8,}$/;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate no empty fields
    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate password format
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be 8+ chars, 1 uppercase, 1 digit & 1 special char (@ # $ _)"
      );
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate terms
    if (!formData.terms) {
      setError("Please agree to Terms & Conditions");
      return;
    }

    try {
      // Get existing users from localStorage
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

      // Check if email already exists
      const emailExists = users.some((u) => u.email === formData.email);
      if (emailExists) {
        setError("Email already registered. Please use a different email.");
        return;
      }

      // Create user object
      const name = formData.firstName + (formData.lastName ? ` ${formData.lastName}` : "");
      
      // Encode password with base64
      let encodedPassword;
      try {
        encodedPassword = btoa(formData.password);
      } catch (encodeErr) {
        console.error("Error encoding password:", encodeErr);
        setError("An error occurred. Please try again.");
        return;
      }

      const newUser = {
        name: name,
        email: formData.email,
        password: encodedPassword,
      };

      // Add user to array
      users.push(newUser);

      // Save to localStorage
      try {
        localStorage.setItem("users", JSON.stringify(users));
      } catch (storageErr) {
        console.error("Error saving to localStorage:", storageErr);
        setError("Failed to save user. Please try again.");
        return;
      }

      // Redirect to login
      alert("Signup successful! Redirecting to login...");
      window.location.href = "/login";
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <style>{css}</style>

      <div className="card">
        {/* LEFT PANEL */}
        <div className="left">
          <div className="brand">
            <h1>Safe</h1>
            <h1>Journey</h1>
          </div>

          <div className="notch notch-signup">
            <button className="tab" onClick={() => navigate("/login")}>
              LOGIN
            </button>
            <button className="tab active">SIGN UP</button>
          </div>

          <div className="left-decor deco1"></div>
          <div className="left-decor deco2"></div>
          <div className="left-decor deco3"></div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <h2>SIGN UP</h2>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="form-group">
              <label>Gender:</label>
              <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
                {["male", "female", "other"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      required
                    />{" "}
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="bangalore">Bangalore</option>
              <option value="mumbai">Mumbai</option>
              <option value="chennai">Chennai</option>
              <option value="pune">Pune</option>
              <option value="delhi">Delhi</option>
            </select>

            <div className="inputRow">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputRow">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <label style={{ fontSize: "13px" }}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />{" "}
              I agree to Terms & Conditions
            </label>

            {error && <div className="error">{error}</div>}

            <button className="primary" type="submit">
              SIGN UP
            </button>

            <p
              style={{
                marginTop: "12px",
                color: "#ff758c",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const css = `
:root{
  --pink1:#ff7eb3;
  --pink2:#ff758c;
  --cardW:980px;
  --cardH:560px;
  --white:#ffffff;
  --dark:#222326;
}

.login-page{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background: #3d0d49ff;
  font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 10px 150px;
}

/* CARD */
.card{
  width:var(--cardW);
  max-width:95%;
  height:var(--cardH);
  background:transparent;
  display:flex;
  border-radius:12px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.2);
  overflow:hidden;
  position:relative;
}

/* LEFT PANEL */
.left{
  width:40%;
  position:relative;
  padding:36px 28px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg, #A45EEA, #7C2ED3);
  color:white;
}

.left-decor{
  position:absolute;
  border-radius:18px;
  filter: blur(0.2px);
  opacity:0.9;
}
.left-decor.deco1{
  width:240px;
  height:240px;
  top:-40px;
  left:-40px;
  transform: rotate(30deg);
  background:linear-gradient(45deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));
}
.left-decor.deco2{
  width:420px;
  height:420px;
  bottom:-110px;
  left:-110px;
  transform: rotate(18deg);
  background:linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0));
}
.left-decor.deco3{
  width:380px;
  height:240px;
  top:90px;
  left:-80px;
  transform: rotate(-10deg);
  background:linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
}

/* BRAND */
.brand{
  position:relative;
  z-index:2;
  text-align:center;
}
.brand h1{
  margin:0;
  font-size:34px;
  letter-spacing:1px;
}

/* NOTCH */
.notch{
  position:absolute;
  right:-58px;
  top:36%;
  width:168px;
  height:150px;
  background:#fff;
  border-radius:90px 0 0 90px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  box-shadow:0 8px 18px rgba(0,0,0,0.12);
  gap:6px;
}
.tab{
  font-size:13px;
  font-weight:700;
  border:none;
  background:transparent;
  color:#888;
  cursor:pointer;
  padding:6px 12px;
}
.tab.active{
  background:linear-gradient(90deg, #A45EEA, #7C2ED3);
  color:#fff;
  border-radius:18px;
}

/* RIGHT PANEL */
.right{
  width:60%;
  background:var(--white);
  padding:44px 48px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  overflow-y:auto;
}

/* FORM */
.form{
  width:86%;
  display:flex;
  flex-direction:column;
  gap:12px;
}
.form input,
.form select{
  padding:12px;
  border:1px solid #e6e6e6;
  border-radius:8px;
  font-size:14px;
}
.form input:focus,
.form select:focus{
  border-color:#ff758c;
  outline:none;
  box-shadow:0 0 0 2px rgba(255,117,140,0.25);
}

/* PASSWORD FIELD */
.inputRow{
  display:flex;
  align-items:center;
  border:1px solid #e6e6e6;
  border-radius:8px;
  padding:4px 8px;
}
.inputRow input{
  width:100%;
  padding:10px;
  border:none;
  outline:none;
}

/* BUTTON */
.primary{
  background: linear-gradient(90deg, #A45EEA, #7C2ED3);
  color:#fff;
  border:none;
  padding:12px 18px;
  border-radius:28px;
  font-weight:700;
  cursor:pointer;
}
.primary:hover{
  transform:translateY(-2px);
}

/* ERROR */
.error{
  color:#b12b2b;
  background: #7C2ED3;
  padding:8px;
  border-radius:6px;
  font-size:13px;
}

/* SMALL SCREENS */
@media (max-width:880px){
  .card{
    flex-direction:column;
    height:auto;
  }
  .left{
    width:100%;
    height:200px;
  }
  .right{
    width:100%;
  }
  .notch{
    display:none;
  }
}
`;