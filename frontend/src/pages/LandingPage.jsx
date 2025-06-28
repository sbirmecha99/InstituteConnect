import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import InkTrail from "../components/InkTrail";
import CountersSection from "../components/CounterSection";
import Footer from "../components/Footer";


const quotes = [
  "Connecting Institutes, Students, and Faculty seamlessly.",
  "Your campus, organized and simplified.",
  "Book appointments, get notified, stay informed.",
];

const LandingPage = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentChar = 0;
    const interval = setInterval(() => {
      setDisplayedText(quotes[quoteIndex].substring(0, currentChar + 1));
      currentChar++;
      if (currentChar === quotes[quoteIndex].length) {
        clearInterval(interval);
        setTimeout(() => {
          setQuoteIndex((prev) => (prev + 1) % quotes.length);
          setDisplayedText("");
        }, 2000);
      }
    }, 90);
    return () => clearInterval(interval);
  }, [quoteIndex]);

  return (
    <>
      <Box
        sx={{
          fontFamily: "Poppins",
          position: "relative",
          minHeight: "100vh",
          height: "fit-content",
          width: "100%",
          backgroundImage: "url('/upscaled.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          color: "#fff",
          cursor: 'url("/pen.png") 0 0, auto',
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: { xs: 8, sm: 12, md: 16 },
          px: 2,
          mb: 0,
          pb: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 30,
            display: "flex",
            gap: 2,
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            href="/login"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.8)",
              color: "#5F77B7",
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            href="/register"
            sx={{
              bgcolor: "#5F77B7",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { bgcolor: "#405ba5" },
            }}
          >
            Signup
          </Button>
        </Box>

        <Container
          sx={{
            textAlign: "center",
            borderRadius: 4,
            p: { xs: 2, sm: 4, md: 0.1 },
            maxWidth: "700px",
            color: "#131640",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, sm: 2 },
              mb: { xs: 2, sm: 4, md: 2 },
              flexWrap: "wrap",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                height: { xs: 40, sm: 60, md: 70 },
                width: { xs: 40, sm: 60, md: 70 },
                transition: "transform 1.5s ease",
                "&:hover": { transform: "rotate(360deg)" },
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                textAlign: "center",
              }}
            >
              InstituteConnect
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              minHeight: "2em",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              color: "rgb(75, 96, 156)",
              fontWeight: 600,
            }}
          >
            {displayedText}
          </Typography>
        </Container>
      </Box>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#fff",
          py: { xs: 4, sm: 6 },
          textAlign: "center",
          mt: 0,
        }}
      >
        <CountersSection />
      </Box>
      <Footer/>
    </>
  );
  
};

export default LandingPage;
