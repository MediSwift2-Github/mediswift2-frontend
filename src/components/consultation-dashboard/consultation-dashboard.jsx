// src/components/consultation-dashboard/consultation-dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './consultation-dashboard.css'; // Assuming basic CSS setup for now

const ConsultationDashboard = () => {
    const [sessionSummary, setSessionSummary] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function that navigates to the Documentation Page
    const navigateToDocumentationPage = () => {
        navigate('/documentation'); // Use navigate function with the path
    };

    // Use useSelector to get the selected patient from the Redux store
    const selectedPatient = useSelector(state => state.patient.selectedPatient);
    // Adjust the date as needed, or modify the backend to not require this parameter
    const patientId = selectedPatient ? selectedPatient.patientId : null;
    // Generate the current date in YYYY-MM-DD format
    const currentDate = new Date();
    const summaryDate = currentDate.toISOString().split('T')[0];

    // Function to start recording audio
    const startRecording = async () => {
        console.log('Starting recording...');

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioChunks((currentChunks) => [...currentChunks, event.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        }
    };

    // Function to stop recording and send audio to the backend
    const stopRecording = () => {
        if (mediaRecorder) {
            const finalChunkPromise = new Promise((resolve) => {
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setAudioChunks((currentChunks) => {
                            const newChunks = [...currentChunks, event.data];
                            resolve(newChunks);
                            return newChunks;
                        });
                    }
                };
            });

            mediaRecorder.stop(); // This will trigger the ondataavailable one last time
            setRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Stop the media stream

            finalChunkPromise.then((finalChunks) => {
                const audioBlob = new Blob(finalChunks, { 'type': 'audio/mp3' });

                // Create FormData to send the blob
                const formData = new FormData();
                formData.append("audioFile", audioBlob, "recording.mp3");
                formData.append("patientId", patientId);
                formData.append("summaryDate", summaryDate);

                // Add any other metadata you might need to send

                // Use fetch to send the audio blob to your server
                fetch('/api/audio/upload', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Success:', data);
                        // Handle success, maybe set some state to show the upload was successful
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        // Handle error, maybe set some state to show the upload failed
                    });
            });
        }
    };




    // Toggle recording state
    const toggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };


    useEffect(() => {
        if (patientId) {
            fetch(`/api/patients/${patientId}/summaries?date=${summaryDate}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const summary = JSON.parse(data[0].summaryContent);
                        setSessionSummary(summary);
                    }
                })
                .catch(error => {
                    console.error('Error fetching session summary:', error);
                });
        }
    }, [patientId, summaryDate]);

    // Function to render JSON data, omitting null values and properly displaying nested objects and arrays
    const renderJson = (data, indent = 0) => {
        if (Array.isArray(data)) {
            return (
                <ul style={{ paddingLeft: indent * 20 }}>
                    {data.map((item, index) => (
                        <li key={index}>
                            {renderJson(item, indent + 1)}
                        </li>
                    ))}
                </ul>
            );
        } else if (typeof data === 'object' && data !== null) {
            return (
                <div style={{ marginLeft: indent * 20 }}>
                    {Object.entries(data).map(([key, value]) => {
                        if (value === null) {
                            return null; // Skip null values
                        }
                        return (
                            <div key={key}>
                                <strong>{key}:</strong> {renderJson(value, indent + 1)}
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <span>{String(data)}</span>;
        }
    };

    return (
        <div className="consultation-dashboard">
            <h1>Consultation Dashboard</h1>
            <button onClick={toggleRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {sessionSummary ? (
                <div>
                    <h2>Summary for {summaryDate}</h2>
                    {renderJson(sessionSummary)}
                </div>
            ) : (
                <p>Loading session summary...</p>
            )}
            <button onClick={navigateToDocumentationPage}>Start Documentation</button>
        </div>
    );
};

export default ConsultationDashboard;
