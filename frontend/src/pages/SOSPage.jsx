import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SOSPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [contacts, setContacts] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    setContacts(saved);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoadingLocation(false);
        },
        () => {
          alert("Unable to access location. Enable GPS.");
          setLoadingLocation(false);
        }
      );
    }
  }, []);

  const sendSOS = () => {
    if (contacts.length === 0)
      return alert("Please add at least one emergency contact");

    if (!location.lat) return alert("Fetching location... wait!");

    const message = encodeURIComponent(
      `🚨 I am in danger!\n📍 Location: https://www.google.com/maps?q=${location.lat},${location.lng}`
    );

    contacts.forEach((num) => {
      const trimmed = String(num).replace(/\D/g, "");
      window.open(`https://wa.me/91${trimmed}?text=${message}`, "_blank");
    });

    alert("SOS Sent 🚨");
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Navbar with Back + Title + Logout */}
      <div style={styles.navbar}>
        <button style={styles.backArrow} onClick={() => navigate(-1)}>
          ←
        </button>

        <h3 style={styles.navTitle}>SafeJourney</h3>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("authUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>🚨 SOS Emergency Alert</h2>
        <p style={styles.desc}>
          Tap and send your live location to your emergency contacts ⚠
        </p>

        {loadingLocation ? (
          <p style={styles.infoText}>Fetching location… ⏳</p>
        ) : (
          <p style={styles.infoText}>
            Location Ready ✅ <br />
            <small>
              Lat: {location.lat?.toFixed(4)} | Lng: {location.lng?.toFixed(4)}
            </small>
          </p>
        )}

        <p style={styles.infoText}>Saved Contacts: {contacts.length}/3</p>

        <button style={styles.sosBtn} onClick={sendSOS}>
          📡 SEND SOS ALERT
        </button>

        <button style={styles.backBtn} onClick={() => navigate("/emergency")}>
          Manage Contacts
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "80px",

    /* 💜 Animated Violet Gradient */
    background: "linear-gradient(-45deg, #e9d3ff, #c79afe, #b181f0, #d6b6ff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 10s ease infinite",
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    background: "#9A4DFF",
    padding: "10px 20px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },

  backArrow: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "28px",
    cursor: "pointer",
    fontWeight: "900",
  },

  navTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },

  logoutBtn: {
    background: "#E63946",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    width: "90%",
    maxWidth: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "22px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
    textAlign: "center",
  },

  title: { fontSize: "26px", fontWeight: "700", color: "#4b0082" },
  desc: { color: "#444", marginBottom: "20px" },
  infoText: { marginBottom: "15px", fontSize: "15px", color: "#222" },

  sosBtn: {
    background: "#E63946",
    color: "#fff",
    border: "none",
    padding: "15px 20px",
    width: "100%",
    borderRadius: "25px",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "10px",
  },

  backBtn: {
    background: "#1d3557",
    marginTop: "15px",
    color: "#fff",
    border: "none",
    width: "100%",
    padding: "12px 22px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
  },
};