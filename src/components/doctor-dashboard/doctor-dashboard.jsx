import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios"; // Make sure to install axios if you haven't
import { useDispatch } from "react-redux";
import { selectPatient } from "../../features/selectedPatient/patientSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api";
import "./doctor-dashboard.css";
import io from "socket.io-client"; // Import io from socket.io-client
import MoreVertIcon from "@mui/icons-material/MoreVert";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ITEM_HEIGHT = 48;

const DoctorDashboard = () => {
  const [queue, setQueue] = useState([]); // State to store the queue
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = io.connect(API_URL); // Connect to the socket

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Function to fetch queue data
    const fetchQueue = async () => {
      try {
        const response = await api.get("/api/queue");
        setQueue(
          response.data.map((patient) => ({
            ...patient,
            statusText:
              patient.status === "Completed"
                ? "Completed"
                : "Start Consultation",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch queue:", error);
      }
    };

    fetchQueue(); // Call the function when the component mounts
    // Setup WebSocket listener for queue updates
    socket.on("queueUpdate", () => {
      console.log("Queue update received");
      fetchQueue(); // Refetch the queue data when an update is received
    });

    // Cleanup function to remove the socket listener
    return () => {
      socket.off("queueUpdate");
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleStartConsultation = (patient) => {
    console.log("Starting consultation for:", patient); // Log the patient details

    // Dispatch the selectPatient action with the patient as payload
    dispatch(selectPatient(patient));
    navigate("/consultation-dashboard");
    // Additional logic for starting the consultation can be added here
  };

  return (
    <Container
      style={{
        position: "relative",
        marginTop: "50px",
        marginBottom: "50px",
        // top: "52%",
        // left: "50%",
        // transform: "translate(-50%, -50%)",
      }}
    >
      <Typography
        className="title"
        variant="h4"
        component="h6"
        style={{ fontSize: "1rem", fontWeight: "bolder" }}
      >
        Consultation Dashboard
      </Typography>
      <TableContainer component={Paper} style={{ borderRadius: "0.75rem" }}>
        <Table aria-label="simple table" style={{ marginTop: "70px" }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Sr No.
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Patient Name
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.map((entry, index) => (
              <TableRow
                key={entry._id}
                style={{
                  backgroundColor:
                    entry.status === "Completed" ? "#e0e0e0" : "inherit",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  style={{ color: "rgb(123, 128, 154)", padding: "16px 25px" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell style={{ color: "rgb(123, 128, 154)" }}>
                  {entry.patientName}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                    textTransform: "lowercase",
                  }}
                  align="center"
                >
                  {entry.status}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    <MenuItem
                      variant="contained"
                      color="primary"
                      onClick={() => handleStartConsultation(entry)}
                      disabled={entry.status === "Completed"}
                      // style={{
                      //   background:
                      //     "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                      // }}
                    >
                      {entry.statusText}
                    </MenuItem>
                  </Menu>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartConsultation(entry)}
                    disabled={entry.status === "Completed"}
                    style={{
                      background:
                        "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                    }}
                  >
                    {entry.statusText}
                  </Button> */}
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
