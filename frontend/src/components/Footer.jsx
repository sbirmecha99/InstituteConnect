import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Container,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, DisabledByDefault } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#131640",
        color: "#fff",
        py: { xs: 4, sm: 6 },
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand/Logo */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              InstituteConnect
            </Typography>
            <Typography variant="body2">
              Bringing your campus community together.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom >
              Quick Links
            </Typography>
            <Box>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                display="block"
                mb={0.5}
              >
                About
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                display="block"
                mb={0.5}
              >
                Contact
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                display="block"
                mb={0.5}
              >
                Privacy Policy
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" mb={1}>
              Email: support@instituteconnect.com
            </Typography>
            <Typography variant="body2" mb={1}>
              Phone: +91-62899-26624
            </Typography>
            <Box display="flex" gap={1} mt={1}>
              <IconButton sx={{ color: "#fff" }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="center" pt={4}>
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} InstituteConnect. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
