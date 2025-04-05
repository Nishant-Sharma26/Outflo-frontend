import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#333", boxShadow: 3 }}>
      <Toolbar sx={{ paddingLeft: 0, paddingRight: 0 }}>
        <Box sx={{ display: "flex",  justifyContent: "space-between", width: "100%", maxWidth: "lg", margin: "0 auto" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", letterSpacing: 1, marginLeft: 0 }}
          >
            OutFlo
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#555" },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/message-generator"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#555" },
              }}
            >
              Message Generator
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/get-campaigns"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#555" },
              }}
            >
             Campaign Dahboard
            </Button>
            
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;