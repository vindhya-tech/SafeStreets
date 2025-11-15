import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  let authUser = {};
  try {
    const authUserStr = localStorage.getItem("authUser");
    if (authUserStr) {
      authUser = JSON.parse(authUserStr);
    }
  } catch (err) {
    console.error("Error parsing authUser:", err);
    localStorage.removeItem("authUser");
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleViewMap = () => {
    navigate("/map"); // 👉 Navigates to SafeRouteMap.jsx
  };

  const handleEmergency = () => {
    navigate("/emergency"); // 👉 emergency setup page later
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to SafeJourney Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Hello, {authUser.name || "User"}!</h2>
          <p style={styles.cardText}>Email: {authUser.email}</p>
          <p style={styles.cardText}>You are successfully logged in.</p>

          {/* New Buttons */}
          <div style={styles.btnSection}>
            <button style={styles.primaryBtn} onClick={handleEmergency}>
              📞 Set Emergency Contact
            </button>

            <button style={styles.secondaryBtn} onClick={handleViewMap}>
              🗺 View Safe Route Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7cbd4ff",
    padding: "20px",
    fontFamily: '"Poppins", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    marginBottom: "30px",
  },
  title: {
    color: "#333",
    margin: 0,
  },
  logoutBtn: {
    background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
  },
  cardTitle: {
    color: "#333",
    marginTop: 0,
  },
  cardText: {
    color: "#666",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  btnSection: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "12px 20px",
    background: "#e63946",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
  secondaryBtn: {
    padding: "12px 20px",
    background: "#1d3557",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};
