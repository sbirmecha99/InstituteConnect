import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => (
  <Box
    component={Link}
    to="/"
    sx={{
      position: "absolute",
      top: 16,
      left: 16,
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      zIndex: 1000,
    }}
  >
    <Box
      component="img"
      src="/logo.png"
      alt="InstituteConnect"
      sx={{
        height: { xs: 40, sm: 50, md: 60 },
        width: "auto",
      }}
    />
  </Box>
);

export default Header;
