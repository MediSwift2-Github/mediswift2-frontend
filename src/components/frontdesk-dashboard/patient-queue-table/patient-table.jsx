import React, { useState, useEffect } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from 'axios'; // Make sure to install axios if you haven't

export const PatientTable = () => {
    // State to store the fetched data
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // Function to fetch data from the endpoint
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/queue');
                // Mapping the data assuming 'patientId' is populated with the patient object and 'status' for patient status
                const queueData = response.data.map((entry) => ({
                    id: entry.patientId._id, // Assuming patientId is populated with the patient object
                    name: entry.patientId.name,
                    status: entry.status // Adjusted for clarity
                }));
                setRows(queueData);
            } catch (error) {
                console.error("Failed to fetch queue entries:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1} {/* Here we use the index for the serial number */}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                                <Button variant="outlined">{row.status}</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
