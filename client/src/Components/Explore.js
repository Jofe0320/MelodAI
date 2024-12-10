import React from "react";
import { Grid, Typography, Card, CardContent, CardMedia, Box } from "@mui/material";

export default function ExplorePage() {
  const melodies = [
    { name: "Name A", user: "User A", audioSrc: "/audioA.mp3", duration: "01:04" },
    { name: "Name B", user: "User B", audioSrc: "/audioB.mp3", duration: "01:04" },
    { name: "Name C", user: "User C", audioSrc: "/audioC.mp3", duration: "01:04" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1d3557, #457b9d)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: "white",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
          mb: 5,
        }}
      >
        Sample Melodies
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {melodies.map((melody, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                borderRadius: "15px",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    color: "#1d3557",
                  }}
                >
                  {melody.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#457b9d",
                    mb: 2,
                  }}
                >
                  By: {melody.user}
                </Typography>
              </CardContent>
              <Box sx={{ width: "100%", mb: 2 }}>
                <audio controls style={{ width: "100%", borderRadius: "5px" }}>
                  <source src={melody.audioSrc} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.9rem",
                  color: "#6c757d",
                }}
              >
                Duration: {melody.duration}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}