import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Button } from "@mui/material";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const DeletePatientDialog = ({ isOpen, onClose }) => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${API_URL}/api/queue`);
                const data = await response.json();
                setPatients(data); // Assuming the API returns an array of patient objects
            } catch (error) {
                // console.error("Error fetching patients:", error);
                setPatients([]);
            }
        };

        if (isOpen) {
            fetchPatients();
        }
    }, [isOpen]); // Fetch patients only when the dialog is opened

    const handleDeletePatient = async (patientId) => {
        try {
            await fetch(`${API_URL}/api/queue/remove?patientId=${patientId}`, { method: 'DELETE' });
            // console.log('Patient deleted successfully');
            onClose(); // Close the dialog and rely on websocket for UI update
        } catch (error) {
            // console.error('Failed to delete patient', error);
            // MVP: Detailed error handling can be added later
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Delete Patient</DialogTitle>
            <List>
                {patients.map((patient) => (
                    <ListItem
                        key={patient.patientId}
                        secondaryAction={
                            <Button color="error" onClick={() => handleDeletePatient(patient.patientId)}>
                                Delete
                            </Button>
                        }>
                        <ListItemText primary={patient.patientName} secondary={patient.patientMobileNumber} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
};
