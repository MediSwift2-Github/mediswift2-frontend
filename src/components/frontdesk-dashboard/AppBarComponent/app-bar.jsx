import {AppBar, Toolbar, Typography} from "@mui/material";

export const AppBarComponent = () => (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Front Desk Dashboard
            </Typography>
        </Toolbar>
    </AppBar>
);
