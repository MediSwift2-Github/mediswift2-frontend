import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  styled,
  Toolbar,
} from "@mui/material";

import { NewPatientDialog } from "../dailog-boxes/new-patient-dailog";
import { OldPatientDialog } from "../dailog-boxes/old-patient-dialog";
import { DeletePatientDialog } from "../dailog-boxes/delete-patient-dialog";
import Grid from "@mui/material/Grid";

import "./drawer.css";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const DrawerPaper = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
  },
}));

export const DrawerComponent = () => {
  const [isNewPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [isOldPatientDialogOpen, setOldPatientDialogOpen] = useState(false);
  const [isDeletePatientDialogOpen, setDeletePatientDialogOpen] =
    useState(false);

  const handleNewPatientClick = () => setNewPatientDialogOpen(true);
  const handleOldPatientClick = () => setOldPatientDialogOpen(true);
  const handleDeletePatientClick = () => setDeletePatientDialogOpen(true);
  const handleClearQueue = async () => {
    try {
      await fetch(`${API_URL}/api/queue/remove?clearAll=true`, {
        method: "DELETE",
      });
      console.log("Queue cleared successfully");
      // Force a page reload to ensure the UI is in sync with the back end
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear the queue", error);
      // MVP: Error handling can be expanded in future iterations
    }
  };

  return (
    <DrawerPaper variant="permanent" anchor="left">
      {/* <Toolbar /> */}
      <Grid className="mainLogo">
        <Typography variant="h5">MediSwift</Typography>
      </Grid>
      <Button color="primary" onClick={handleNewPatientClick}>
        New Patient
      </Button>
      <Button color="secondary" onClick={handleOldPatientClick}>
        Old Patient
      </Button>
      <NewPatientDialog
        isOpen={isNewPatientDialogOpen}
        onClose={() => setNewPatientDialogOpen(false)}
      />
      <OldPatientDialog
        isOpen={isOldPatientDialogOpen}
        onClose={() => setOldPatientDialogOpen(false)}
      />
      <Button color="error" onClick={handleDeletePatientClick}>
        Delete Patient
      </Button>
      <Button color="warning" onClick={handleClearQueue}>
        Clear Queue
      </Button>
      <DeletePatientDialog
        isOpen={isDeletePatientDialogOpen}
        onClose={() => setDeletePatientDialogOpen(false)}
      />
    </DrawerPaper>
  );
};
