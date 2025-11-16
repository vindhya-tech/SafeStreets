import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmergencyPage() {
  const navigate = useNavigate();

  const [contactList, setContactList] = useState([]);
  const [contact, setContact] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    setContactList(saved);
  }, []);

  const handleSave = () => {
    if (contact.trim().length < 10) {
      alert("Please enter a valid phone number!");
      return;
    }

    if (contactList.length >= 3) {
      alert("You can only add up to 3 contacts");
      return;
    }

    const updatedContacts = [...contactList, contact];
    setContactList(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
    setContact("");
  };

  const handleDelete = (index) => {
    const updatedContacts = contactList.filter((_, i) => i !== index);
    setContactList(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
  };

  return (
    <div style={styles.container}>

      {/* 🔥 Navbar with Back & Logout */}
      <div style={styles.navbar}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          style={styles.backBtn}
        >
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

      {/* Card Box */}
      <div style={styles.card}>
        <h2 style={styles.title}>Emergency Contact Setup</h2>
        <p style={styles.desc}>Add up to 3 trusted contacts 🚨</p>

        <input
          type="tel"
          placeholder="Enter phone number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSave} style={styles.saveBtn}>
          Save Contact
        </button>

        <button
          style={styles.mapBtn}
          onClick={() => navigate("/map")}
        >
          🗺 Proceed to Maps
        </button>

        {contactList.length > 0 && (
          <div style={styles.listContainer}>
            <h3 style={styles.savedTitle}>Saved Contacts</h3>

            {contactList.map((num, index) => (
              <div key={index} style={styles.contactCard}>
                <span>{num}</span>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}
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
    background: "linear-gradient(-45deg, #e9d3ff, #c79afe, #b181f0, #d6b6ff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 10s ease infinite",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "#9A4DFF",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    zIndex: 1000
  },

  backBtn: {
    position: "absolute",
    left: "15px",
    background: "transparent",
    border: "none",
    fontSize: "26px",
    fontWeight: "900",
    color: "#fff",
    cursor: "pointer",
  },

  navTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
  },

  logoutBtn: {
    position: "absolute",
    right: "15px",
    background: "#E63946",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "white",
    width: "90%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "25px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },

  title: { fontSize: "24px", fontWeight: "700", color: "#4b0082" },
  desc: { fontSize: "15px", marginBottom: "15px", color: "#555" },

  input: {
    width: "100%",
    padding: "12px",
    fontSize: "17px",
    borderRadius: "12px",
    border: "1px solid #aaa",
    marginBottom: "15px",
  },

  saveBtn: {
    width: "100%",
    background: "#1d3557",
    color: "white",
    padding: "12px 0",
    fontSize: "16px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    marginBottom: "12px",
  },

  mapBtn: {
    width: "100%",
    background: "#7C2ED3",
    color: "white",
    padding: "12px 0",
    fontSize: "16px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    marginBottom: "15px",
    boxShadow: "0 6px 20px rgba(124,46,211,0.4)"
  },

  listContainer: {
    marginTop: "20px",
    textAlign: "left"
  },

  savedTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "600",
  },

  contactCard: {
    background: "#f4ebff",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
  },

  deleteBtn: {
    background: "#d90429",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};