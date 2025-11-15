import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SOSPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [contacts, setContacts] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    // Load saved emergency contacts (array of numbers)
    const saved = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    setContacts(saved);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (err) => {
          console.error(err);
          alert("Unable to access your location. Please enable GPS / Location.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  }, []);

  const sendSOS = () => {
    if (contacts.length === 0) {
      alert("Please add at least one emergency contact first!");
      return;
    }

    if (!location.lat || !location.lng) {
      alert("Still fetching your location. Please wait a few seconds and try again.");
      return;
    }

    const message = encodeURIComponent(
      `🚨 I am in danger!\n` +
      `📍 My live location: https://www.google.com/maps?q=${location.lat},${location.lng}\n` +
      `Please help me immediately!`
    );

    // Open WhatsApp chat for EACH saved contact
    contacts.forEach((num) => {
      // assuming Indian numbers, add 91 – change as needed
      const trimmed = String(num).replace(/\D/g, ""); // remove spaces, dashes
      window.open(`https://wa.me/91${trimmed}?text=${message}`, "_blank");
    });

    alert("SOS triggered! WhatsApp chats opened for all emergency contacts 🚨");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚨 SOS Emergency Alert</h2>

      <p style={styles.desc}>
        One tap will send your live location to all saved emergency contacts via WhatsApp.
      </p>

      {loadingLocation ? (
        <p style={styles.infoText}>Fetching your current location… ⏳</p>
      ) : (
        <p style={styles.infoText}>
          Location ready ✅<br />
          <small>
            Lat: {location.lat?.toFixed(4)} | Lng: {location.lng?.toFixed(4)}
          </small>
        </p>
      )}

      <p style={styles.infoText}>
        Saved emergency contacts: {contacts.length}/3
      </p>

      <button style={styles.sosBtn} onClick={sendSOS}>
        📡 SEND SOS ALERT
      </button>

      <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fa9aa1",
    padding: "40px",
    textAlign: "center",
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#7D0808",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "17px",
    color: "#333",
    marginBottom: "20px",
  },
  infoText: {
    fontSize: "14px",
    color: "#222",
    marginBottom: "12px",
  },
  sosBtn: {
    background: "#e63946",
    color: "white",
    border: "none",
    padding: "16px 30px",
    borderRadius: "40px",
    fontSize: "20px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  },
  backBtn: {
    marginTop: "20px",
    background: "#1d3557",
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};
