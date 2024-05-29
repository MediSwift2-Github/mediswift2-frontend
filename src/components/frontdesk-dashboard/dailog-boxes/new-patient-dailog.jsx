import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  CircularProgress,
} from "@mui/material";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const NewPatientDialog = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleAddPatient = async () => {
    setLoading(true); // Set loading to true when the request starts
    try {
      // Construct the patient data
      const patientData = {
        name,
        mobile_number: contact,
        medical_history: [], // You can initially send an empty array or omit this if your backend handles it
      };

      // Make the POST request to the server to add a new patient
      const response = await fetch(`${API_URL}/api/newpatient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      // Check if the request to add a new patient was successful
      if (response.ok) {
        console.log("Patient added successfully");

        // Extract the newly added patient's data, including the _id
        const addedPatient = await response.json();

        // Now, use the _id of the newly added patient to add them to the queue
        const queueResponse = await fetch(`${API_URL}/api/queue/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId: addedPatient._id }),
        });

        if (queueResponse.ok) {
          console.log("Patient added to the queue successfully");
          // Handle successful queue addition here (e.g., update UI)
        } else {
          // Handle failure to add patient to the queue
          console.error(
            "Failed to add patient to queue",
            await queueResponse.text()
          );
        }
      } else {
        // If the server responded with an error when adding a new patient, handle it here
        console.error("Failed to add patient", await response.text());
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch operations
      console.error("Error during patient add or queue operation", error);
    } finally {
      setLoading(false); // Set loading to false when the request ends
    }

    onClose(); // Close the dialog after submitting
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Patient</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="contact"
          label="Contact"
          type="text"
          fullWidth
          variant="outlined"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddPatient} variant="contained" color="primary" disabled={loading} >
            {loading ? <CircularProgress size={24} /> : "Add Patient"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
