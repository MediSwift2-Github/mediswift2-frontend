import React, { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Paper
} from '@mui/material';
import axios from 'axios'; // Make sure to install axios if you haven't

const DoctorDashboard = () => {
    const [queue, setQueue] = useState([]); // State to store the queue

    useEffect(() => {
        // Function to fetch queue data
        const fetchQueue = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/queue');
                setQueue(response.data); // Update state with fetched data
            } catch (error) {
                console.error('Failed to fetch queue:', error);
            }
        };

        fetchQueue(); // Call the function when the component mounts
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Container>
            <Typography variant="h4" component="h1">
                Consultation Dashboard
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No.</TableCell>
                            <TableCell>Patient Name</TableCell>

                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queue.map((entry, index) => (
                            <TableRow key={entry._id}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell>{entry.patientName}</TableCell>


                                <TableCell align="right">
                                    {/* Action buttons will go here */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DoctorDashboard;
