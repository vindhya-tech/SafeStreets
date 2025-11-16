import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to</h1>
        <h2 style={styles.appName}>SafeJourney</h2>
        <p style={styles.tagline}>
          Your Safety, Our Priority 💜
        </p>

        <button
          style={styles.startButton}
          onClick={() => navigate("/login")}
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(-45deg, #e9d3ff, #c79afe, #b181f0, #d6b6ff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 8s ease infinite",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden"
  },

  overlay: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)",
    animation: "floatGlow 6s infinite linear"
  },

  content: {
    textAlign: "center",
    zIndex: 2,
    color: "#fff",
  },

  title: {
    fontSize: "40px",
    fontWeight: "600",
    marginBottom: "5px"
  },

  appName: {
    fontSize: "55px",
    fontWeight: "900",
    marginBottom: "10px",
    textShadow: "0 4px 12px rgba(0,0,0,0.25)"
  },

  tagline: {
    fontSize: "18px",
    marginBottom: "30px",
    fontWeight: "500"
  },

  startButton: {
    background: "#7C2ED3",
    color: "#fff",
    padding: "14px 30px",
    borderRadius: "35px",
    fontSize: "20px",
    fontWeight: "800",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 8px 25px rgba(124,46,211,0.5)",
    animation: "bounce 1.5s infinite",
    transition: "0.3s"
  },
};

// 🔥 CSS Animations (put inside index.css or App.css)
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes floatGlow {
  0% { transform: translate(-30%, -30%) scale(1); }
  50% { transform: translate(0%, 0%) scale(1.2); }
  100% { transform: translate(-30%, -30%) scale(1); }
}`, styleSheet.cssRules.length);