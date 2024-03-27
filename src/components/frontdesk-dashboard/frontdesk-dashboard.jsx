import React from 'react';
import { Box, Typography, Toolbar } from '@mui/material';
import { AppBarComponent } from "./AppBarComponent/app-bar"; // Adjust the import path as necessary
import { DrawerComponent } from "./drawer-component/drawer"; // Adjust the import path as necessary
import { PatientTable } from "./patient-queue-table/patient-table"; // Adjust the import path as necessary

const FrontDeskDashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBarComponent />
            <DrawerComponent />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
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
