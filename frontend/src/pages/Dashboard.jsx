import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  let authUser = {};
  try {
    const authUserStr = localStorage.getItem("authUser");
    if (authUserStr) authUser = JSON.parse(authUserStr);
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

  return (
    <div style={styles.page}>
      
      {/* Floating 3D icons */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/891/891399.png"
        alt="shield"
        style={{ ...styles.floatingIcon, top: "10%", left: "5%" }}
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
        alt="security"
        style={{ ...styles.floatingIcon2 }}
      />

      {/* Navbar */}
      <header style={styles.navbar}>
        <h2 style={styles.navTitle}>SafeJourney</h2>
        <button style={styles.navLogoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>👋 Welcome, {authUser.name || "User"}!</h1>
        <p style={styles.text}>Email: {authUser.email}</p>
        <p style={styles.text}>Stay safe & aware at every step 💜</p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/emergency")}
          >
            📞 Emergency Contacts
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/map")}
          >
            🗺 Safe Route Map
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(-45deg, #C9A7FF, #A06AFF, #C8B3FF, #9B72FF)",
    backgroundSize: "400% 400%",
    animation: "softWaves 12s ease infinite",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "90px",
    fontFamily: '"Poppins", sans-serif',
    position: "relative",
    overflow: "hidden",
  },

  navbar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 4px 25px rgba(0,0,0,0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    zIndex: 100,
  },

  navTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    textShadow: "0px 1px 3px rgba(0,0,0,0.3)",
  },

  navLogoutBtn: {
    background: "#ffffff",
    color: "#7B2CBF",
    border: "none",
    padding: "9px 20px",
    fontWeight: "700",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  },

  card: {
    width: "90%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.92)",
    padding: "35px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0px 15px 35px rgba(0,0,0,0.25)",
    zIndex: 10,
  },

  floatingIcon: {
    position: "absolute",
    width: "160px",
    opacity: 0.18,
    animation: "floatIcons 10s infinite ease-in-out",
    zIndex: 1,
  },

  floatingIcon2: {
    position: "absolute",
    width: "180px",
    opacity: 0.18,
    bottom: "10%",
    right: "6%",
    animation: "floatIconsReverse 12s infinite ease-in-out",
    zIndex: 1,
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#6E1AFF",
    marginBottom: "10px",
  },

  text: {
    fontSize: "15px",
    color: "#333",
    marginBottom: "6px",
  },

  buttonGroup: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  primaryBtn: {
    padding: "14px",
    background: "#E63946",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    borderRadius: "28px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "14px",
    background: "#1D3557",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    borderRadius: "28px",
    cursor: "pointer",
  },
};


// 🔥 Keyframes (insert dynamically once)
const animations = `
@keyframes softWaves {
 0% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 100% { background-position: 0% 50%; }
}
@keyframes floatIcons {
 0% { transform: translateY(0px) rotate(0deg); }
 50% { transform: translateY(20px) rotate(10deg); }
 100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes floatIconsReverse {
 0% { transform: translateY(0px) rotate(0deg); }
 50% { transform: translateY(-20px) rotate(-10deg); }
 100% { transform: translateY(0px) rotate(0deg); }
}
`;
document.head.insertAdjacentHTML("beforeend", <style>${animations}</style>);