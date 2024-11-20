"use client";

import React, { useState } from "react";
import { Grid, TextField, Button, Typography, Box, Tab, Tabs, Alert } from "@mui/material";

export default function EditProfilePage() {
  const [userInfo, setUserInfo] = useState({
    username: "musiclover123",
    email: "musiclover@example.com",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (field) => {
    const newErrors = {};
    if (field === "username" && !userInfo.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (field === "email") {
      if (!userInfo.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
        newErrors.email = "Email is invalid.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (field) => {
    if (!validateForm(field)) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage(`${field === "username" ? "Username" : "Email"} updated successfully!`);
      setErrors({});
    } catch (error) {
      setSuccessMessage("");
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage(""); // Clear messages on tab change
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh", padding: "1rem" }}>
      <Box
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Update your profile information.
        </Typography>

        {/* Success Message */}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} style={{ marginBottom: "1rem" }} centered>
          <Tab label="Username" />
          <Tab label="Email" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("username");
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="username"
              value={userInfo.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              style={{ marginTop: "1rem" }}
            >
              {isLoading ? "Updating..." : "Update Username"}
            </Button>
          </form>
        )}

        {activeTab === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("email");
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              style={{ marginTop: "1rem" }}
            >
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </form>
        )}
      </Box>
    </Grid>
  );
}
