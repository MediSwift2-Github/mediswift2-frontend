import React, { useState } from 'react';
import {
    Box, Button, Drawer, List, ListItem, styled, Toolbar
} from "@mui/material";

import {NewPatientDialog} from "../dailog-boxes/new-patient-dailog";
import {OldPatientDialog} from "../dailog-boxes/old-patient-dialog";

const drawerWidth = 240;

const DrawerPaper = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
}));

export const DrawerComponent = () => {
    const [isNewPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
    const [isOldPatientDialogOpen, setOldPatientDialogOpen] = useState(false);

    const handleNewPatientClick = () => setNewPatientDialogOpen(true);
    const handleOldPatientClick = () => setOldPatientDialogOpen(true);

    return (
        <DrawerPaper variant="permanent" anchor="left">
            <Toolbar />
            <Button color="primary" onClick={handleNewPatientClick}>New Patient</Button>
            <Button color="secondary" onClick={handleOldPatientClick}>Old Patient</Button>
            <NewPatientDialog
                isOpen={isNewPatientDialogOpen}
                onClose={() => setNewPatientDialogOpen(false)}
            />
            <OldPatientDialog
                isOpen={isOldPatientDialogOpen}
                onClose={() => setOldPatientDialogOpen(false)}
            />
        </DrawerPaper>
    );
};
