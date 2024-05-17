import { AppBar, Toolbar, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import "./app-bar.css";

export const AppBarComponent = ({ navBarStyle, loc }) => (
  <AppBar
    position="fixed"
    className="appBarHeader"
    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    style={{
      marginTop: "17px",
      backgroundColor: `${navBarStyle == "top" ? "transparent" : "none"}`,
      backdropFilter: `${
        navBarStyle == "hide" ? "saturate(200%) blur(1.875rem)" : "none"
      }`,
      border: `${navBarStyle == "hide" ? "1px solid white" : "none"}`,
      paddingLeft: "5px",
      boxShadow: "none",
    }}
  >
    <Toolbar
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
        padding: "10px",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: "5px" }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon
            style={{ color: "rgb(108, 117, 125)", fontSize: "large" }}
          />
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
          style={{ textTransform: "capitalize" }}
        >
          {loc.replace("-", " ")}
        </Link>
      </Breadcrumbs>
      <Typography
        variant="body"
        component="div"
        fontSize="large"
        sx={{ flexGrow: 1 }}
        style={{ color: "rgb(52, 71, 103)", marginTop: "5px" }}
      >
        Front Desk Dashboard
      </Typography>
    </Toolbar>
  </AppBar>
);
