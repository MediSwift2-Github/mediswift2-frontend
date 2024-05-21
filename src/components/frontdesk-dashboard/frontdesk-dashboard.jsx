import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AppBarComponent } from "./AppBarComponent/app-bar"; // Adjust the import path as necessary
import { DrawerComponent } from "./drawer-component/drawer"; // Adjust the import path as necessary
import { PatientTable } from "./patient-queue-table/patient-table"; // Adjust the import path as necessary
import { useLocation } from "react-router-dom";

import "./frontdesk-dashboard.css";

const FrontDeskDashboard = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBarComponent
        navBarStyle={show}
        loc={location.pathname.replace("/", "")}
      />
      <DrawerComponent />
      <Box
        component="main"
        fullWidth
        style={{ width: "calc(100% - 22%)", marginLeft: "calc(100% - 79%)" }}
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          borderRadius: "10px",
          marginTop: "100px", // Adjust the margin top to match the height of the AppBar
          marginBottom: "17px",
          padding: "15px",
          overflow: "auto",
        }}
        className="patientListWrapper"
      >
        {/* <Toolbar /> */}
        <Typography
          variant="h6"
          gutterBottom
          style={{ padding: "15px 0px 0px 15px" }}
        >
          Patient List
        </Typography>
        <PatientTable />
        {/* The PatientDialog components are removed from here since they are now in DrawerComponent */}
      </Box>
    </Box>
  );
};

export default FrontDeskDashboard;
