import React from "react";
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import "./LandingPage.css";

const showcaseLinks = [
  {
    title: "GitHub Repository",
    description: "View the source code of this project.",
    href: "https://github.com/Jofe0320/MelodAI", // Replace with your actual GitHub link
    icon: <GitHubIcon style={{ fontSize: "60px", color: "#333", margin: "16px auto" }} />,
    buttonText: "View on GitHub",
  },
  {
    title: "Elevator Pitch",
    description: "Watch a quick overview of the project.",
    href: "https://drive.google.com/file/d/1m-yAWtVWVlR2btuu501f_A8Z6VLS9y9e/view?usp=sharing", // Replace with your elevator pitch link
    icon: <VideoLibraryIcon style={{ fontSize: "60px", color: "#1976d2", margin: "16px auto" }} />,
    buttonText: "Watch Video",
  },
  {
    title: "Presentation",
    description: "View the project presentation slides.",
    href: "https://docs.google.com/presentation/d/1-sUVBckJU4NKZPfzmkkpd7ZEo1OOU4oPa07ciaz-uqo/edit?usp=sharing", // Replace with your presentation link
    icon: <SlideshowIcon style={{ fontSize: "60px", color: "#f50057", margin: "16px auto" }} />,
    buttonText: "View Slides",
  },
];

const melodies = [
  { name: "Example song",user: "Dev Team", audioSrc: "/songA.mp3", duration: "0:23" },
  { name: "Before User Interaction", user: "Dev Team", audioSrc: "/songC.mp3", duration: "00:34" },
  { name: "After User Interaction", user: "Jofe0320", audioSrc: "/songB.mpeg", duration: "00:31" },
];

export default function LandingPage() {
  return (
    <div className="melodai-container min-h-screen">
      <header className="melodai-header p-4 flex justify-between items-center">
        <h1 className="melodai-logo text-xl font-bold" style={{ color: "black" }}>Melodai</h1>
        <nav className="flex ml-auto space-x-6">
          <Link to="/create-melody" className="melodai-bubble-button text-bg">
            Create Melodies
          </Link>
        </nav>
      </header>

      <main className="melodai-main container mx-auto px-4 py-8 space-y-16">
        <div className="melodai-content grid md:grid-cols-2 gap-8 items-center">
          <div className="melodai-text">
            <h2 className="melodai-title text-4xl font-bold mb-4" style={{ color: "white" }}>
              UNLEASH MUSICAL CREATIVITY
            </h2>
            <p className="melodai-description mb-6" style={{ color: "white" }}>
              Welcome to Melodai, your gateway to endless musical possibilities. Our AI-powered platform lets you create
              unique melodies by simply selecting your desired key, tempo, and genre. Listen to the magic unfold and save
              your creations with ease.
            </p>
            <Link
              to="/landing-form"
              className="melodai-button text-center block bg-blue-500 py-2 px-4 rounded"
              aria-label="Start using Melodai"
              style={{ color: "white" }}
            >
              Get Started
            </Link>
          </div>

          <div className="melodai-images grid gap-4">
            <div className="melodai-image-container aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/musicproduction.webp?height=200&width=300"
                alt="Music production setup"
                className="melodai-image w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="melodai-image-container aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/Consola.webp?height=200&width=300"
                alt="Mixing console"
                className="melodai-image w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="melodai-about bg-gray-200 pt-16 pb-16">
  <h2
  className="melodai-about-title text-3xl font-bold mb-12"
  style={{ color: "white", marginLeft: "370px", width: "fit-content" }}
>
  ABOUT US
</h2>

  <div className="melodai-about-content grid md:grid-cols-2 gap-8">
    <div className="relative melodai-about-images">
      <div className="melodai-about-image-bg">
        <img
          src="/MelodaiLogo.png" // Use the correct path here
          alt="Melodai Logo"
          className="melodai-image w-full h-full object-contain" // Changed from object-cover to object-contain
          loading="lazy"
        />
      </div>
    </div>
    <div>
      <h3 className="melodai-about-subtitle text-2xl font-semibold mb-4" style={{ color: "white" }}>
        Our Mission
      </h3>
      <p className="melodai-about-description mb-6" style={{ color: "white" }}>
        Melodai is a groundbreaking online platform revolutionizing music creation. Our platform empowers users to
        effortlessly generate melodies tailored to their preferences, from classical to contemporary styles. We're
        democratizing music composition through innovative AI technology.
      </p>
    </div>
  </div>
</div>
        {/* Melodies Section */}
        <div className="melodai-melodies-section">
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{
              color: "white",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
              marginBottom: "24px",
            }}
          >
            Sample Melodies
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {melodies.map((melody, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="h5">{melody.name}</Typography>
                  <Typography variant="subtitle1">By: {melody.user}</Typography>
                  <audio controls style={{ width: "100%" }}>
                    <source src={melody.audioSrc} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  <Typography variant="caption" sx={{ marginTop: "8px" }}>
                    Duration: {melody.duration}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Project Showcase Section */}
        <div className="melodai-showcase">
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            style={{ marginBottom: "24px", color: "white" }}
          >
            Project Showcase
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {showcaseLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={4} style={{ transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                  <CardMedia>{link.icon}</CardMedia>
                  <CardContent>
                    <Typography variant="h5" align="center">
                      {link.title}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary" paragraph>
                      {link.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      href={link.href}
                      target="_blank"
                    >
                      {link.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </main>
      <footer align='center'>
      Data provided by Bernd Krueger, under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA). 
      Work gotten from http://www.piano-midi.de

      </footer>
    </div>
  );
}
