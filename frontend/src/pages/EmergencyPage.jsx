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
    setContact(""); // clear input
  };

  const handleDelete = (index) => {
    const updatedContacts = contactList.filter((_, i) => i !== index);
    setContactList(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Emergency Contact Setup</h2>
      <p style={styles.desc}>
        Add up to 3 trusted phone numbers 🚨
      </p>

      <input
        type="tel"
        placeholder="Enter phone number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        style={styles.input}
      />

      <div style={styles.actionBtns}>
        <button onClick={handleSave} style={styles.saveBtn}>
          Save Contact
        </button>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>

      {contactList.length > 0 && (
        <div style={styles.listContainer}>
          <h3 style={styles.savedTitle}>Saved Contacts</h3>

          {contactList.map((num, index) => (
            <div key={index} style={styles.contactCard}>
              <span>{num}</span>
              <button style={styles.deleteBtn} onClick={() => handleDelete(index)}>
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7cbd4ff",
    padding: "40px",
    textAlign: "center",
    fontFamily: '"Poppins", sans-serif',
  },
  title: { fontSize: "28px", color: "#333" },
  desc: { color: "#555", marginBottom: "20px" },
  input: {
    width: "90%",
    maxWidth: "350px",
    padding: "12px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "1px solid #aaa",
    textAlign: "center",
    marginBottom: "20px",
  },
  actionBtns: { display: "flex", gap: "10px", justifyContent: "center" },
  saveBtn: {
    background: "#1d3557",
    color: "#fff",
    border: "none",
    padding: "10px 25px",
    borderRadius: "25px",
    cursor: "pointer",
  },
  backBtn: {
    background: "#e63946",
    color: "#fff",
    border: "none",
    padding: "10px 25px",
    borderRadius: "25px",
    cursor: "pointer",
  },
  listContainer: {
    marginTop: "25px",
    maxWidth: "350px",
    margin: "0 auto",
  },
  savedTitle: { fontSize: "20px", color: "#333", marginBottom: "15px" },
  contactCard: {
    background: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 3px 15px rgba(0,0,0,0.15)",
  },
  deleteBtn: {
    background: "#e63946",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
};
