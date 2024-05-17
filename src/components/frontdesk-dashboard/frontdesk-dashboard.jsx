import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import { AppBarComponent } from "./AppBarComponent/app-bar"; // Adjust the import path as necessary
import { DrawerComponent } from "./drawer-component/drawer"; // Adjust the import path as necessary
import { PatientTable } from "./patient-queue-table/patient-table"; // Adjust the import path as necessary
import { useNavigate, useLocation } from "react-router-dom";

import "./frontdesk-dashboard.css";

const FrontDeskDashboard = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("location---->>", location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = () => {
    if (window.scrollY > 15) {
      if (window.scrollY > lastScrollY) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBarComponent
        navBarStyle={show}
        loc={location.pathname.replace("/", "")}
      />
      <DrawerComponent />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          overflow: "auto",
          width: "1165px",
          borderRadius: "10px",
          marginTop: "90px", // Adjust the margin top to match the height of the AppBar
          height: "80vh",
        }}
        className="patientListWrapper"
      >
        {/* <Toolbar /> */}
        <Typography variant="h6" gutterBottom>
          Patient List
        </Typography>
        <PatientTable />
        {/* The PatientDialog components are removed from here since they are now in DrawerComponent */}
      </Box>
    </Box>
  );
};

export default FrontDeskDashboard;
