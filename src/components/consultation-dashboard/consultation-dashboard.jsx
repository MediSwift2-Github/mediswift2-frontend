// src/components/consultation-dashboard/consultation-dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./consultation-dashboard.css"; // Assuming basic CSS setup for now
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ConsultationDashboard = () => {
  const [sessionSummary, setSessionSummary] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function that navigates to the Documentation Page
  const navigateToDocumentationPage = () => {
    navigate("/documentation"); // Use navigate function with the path
  };

  // Use useSelector to get the selected patient from the Redux store
  const selectedPatient = useSelector((state) => state.patient.selectedPatient);
  // Adjust the date as needed, or modify the backend to not require this parameter
  const patientId = selectedPatient ? selectedPatient.patientId : null;
  // Generate the current date in YYYY-MM-DD format
  const currentDate = new Date();
  const summaryDate = currentDate.toISOString().split("T")[0];

  // Function to start recording audio
  const startRecording = async () => {
    console.log("Starting recording...");

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
      mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // Stop the media stream

      finalChunkPromise.then((finalChunks) => {
        const audioBlob = new Blob(finalChunks, { type: "audio/mp3" });

        // Create FormData to send the blob
        const formData = new FormData();
        formData.append("audioFile", audioBlob, "recording.mp3");
        formData.append("patientId", patientId);
        formData.append("summaryDate", summaryDate);

        // Add any other metadata you might need to send

        // Use fetch to send the audio blob to your server
        fetch(`${API_URL}/api/audio/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            // Handle success, maybe set some state to show the upload was successful
          })
          .catch((error) => {
            console.error("Error:", error);
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
      fetch(
        `${API_URL}/api/patients/${patientId}/summaries?date=${summaryDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const summary = JSON.parse(data[0].summaryContent);
            setSessionSummary(summary);
          }
        })
        .catch((error) => {
          console.error("Error fetching session summary:", error);
        });
    }
  }, [patientId, summaryDate]);

  // Function to render JSON data, omitting null values and properly displaying nested objects and arrays
  const renderJson = (data, indent = 0) => {
    if (Array.isArray(data)) {
      return (
        <ul style={{ paddingLeft: indent * 20 }}>
          {data.map((item, index) => (
            <li key={index}>{renderJson(item, indent + 1)}</li>
          ))}
        </ul>
      );
    } else if (typeof data === "object" && data !== null) {
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

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (value === null) {
      return "None";
    } else if (typeof value === "object") {
      return Object.entries(value)
        .map(
          ([nestedKey, nestedValue]) =>
            `${formatKey(nestedKey)}: ${formatValue(nestedValue)}`
        )
        .join(" -- ");
    } else {
      return value;
    }
  };

  return (
    <div
      className="consultation-dashboard"
      style={{ maxWidth: 1150, margin: "50px auto", padding: "17px" }}
    >
      <TableContainer component={Paper} className="tableContainer">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                style={{ padding: 40, position: "relative" }}
              >
                <Typography
                  variant="h4"
                  component="h6"
                  className="title"
                  style={{ fontSize: "1rem", fontWeight: "bolder" }}
                >
                  Consultation Dashboard
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: "rgb(123, 128, 154)" }}
                >
                  Summary for {summaryDate}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" onClick={toggleRecording}>
                  {recording ? "Stop Recording" : "Start Recording"}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          {/* {console.log(renderJson(sessionSummary))} */}
          <TableBody>
            {sessionSummary ? (
              <>
                {Object.entries(sessionSummary).map(([key, value]) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      <Typography
                        key={key}
                        variant="subtitle2"
                        display="block"
                        gutterBottom
                        style={{ color: "rgb(123, 128, 154)" }}
                      >
                        {`${formatKey(key)}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle2"
                        display="block"
                        gutterBottom
                        key={key}
                        style={{ color: "rgb(123, 128, 154)" }}
                      >
                        {`${formatValue(value)}`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" colSpan={3}>
                  <Typography
                    variant="overline"
                    display="block"
                    gutterBottom
                    style={{ color: "rgb(123, 128, 154)", textAlign: "center" }}
                  >
                    Loading session summary...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        fullWidth
        variant="contained"
        onClick={navigateToDocumentationPage}
        style={{ marginTop: 20, maxWidth: 1200 }}
      >
        Start Documentation
      </Button>
    </div>
  );
};

export default ConsultationDashboard;
