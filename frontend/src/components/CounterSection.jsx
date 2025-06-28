import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CountersSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3, // start when 30% of the section is in view
    triggerOnce: true, // animate only once
  });

  return (
    <Box ref={ref} sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} textAlign="center">
          <Typography variant="h4" fontWeight={700} color="primary">
            {inView ? <CountUp end={15} duration={2} /> : 0}+
          </Typography>
          <Typography variant="subtitle1">Institutes Trust Us</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} textAlign="center">
          <Typography variant="h4" fontWeight={700} color="primary">
            {inView ? <CountUp end={1000} duration={2} /> : 0}+
          </Typography>
          <Typography variant="subtitle1">Happy Students</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} textAlign="center">
          <Typography variant="h4" fontWeight={700} color="primary">
            {inView ? <CountUp end={200} duration={2} /> : 0}+
          </Typography>
          <Typography variant="subtitle1">Faculty Reviews</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CountersSection;
