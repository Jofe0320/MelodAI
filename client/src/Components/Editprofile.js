import React, { useState } from "react";
import { Grid, TextField, Button, Typography, Box, Tab, Tabs, Alert } from "@mui/material";
import axios from "axios";

export default function EditProfilePage() {
  const [userInfo, setUserInfo] = useState({
    currentUsername: "",
    currentPassword: "",
    newUsername: "",
    email: "",
    newPassword: "",
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
    if (!userInfo.currentUsername.trim()) {
      newErrors.currentUsername = "Current username is required.";
    }
    if (!userInfo.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (field === "username" && !userInfo.newUsername.trim()) {
      newErrors.newUsername = "New username is required.";
    }
    if (field === "email") {
      if (!userInfo.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
        newErrors.email = "Email is invalid.";
      }
    }
    if (field === "password" && !userInfo.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (field) => {
    if (!validateForm(field)) return;

    setIsLoading(true);
    try {
      const payload = {
        currentUsername: userInfo.currentUsername,
        currentPassword: userInfo.currentPassword,
      };

      try {
        let response;
      
        if (field === "username") {
          const payload = { 
            currentUsername: userInfo.currentUsername, 
            currentPassword: userInfo.currentPassword, 
            newUsername: userInfo.newUsername 
          };
      
          response = await fetch(`/auth/update-username`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } 
        else if (field === "email") {
          const payload = { 
            currentUsername: userInfo.currentUsername, 
            currentPassword: userInfo.currentPassword, 
            email: userInfo.email 
          };
      
          response = await fetch(`/auth/update-email`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } 
        else if (field === "password") {
          const payload = { 
            currentUsername: userInfo.currentUsername, 
            currentPassword: userInfo.currentPassword, 
            newPassword: userInfo.newPassword 
          };
      
          response = await fetch(`/auth/update-password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }
      
        // Check if the response is okay (status 2xx)
        if (response.ok) {
          const result = await response.json();
          setSuccessMessage(result.message || "Update successful!");
        } else {
          const errorData = await response.json();
          setErrors({ general: errorData.error || "An error occurred." });
        }
      } catch (error) {
        console.error("Error updating:", error);
        setErrors({ general: "Something went wrong. Please try again later." });
      }

      setErrors({});
    } catch (error) {
      setErrors({ form: "Failed to update. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage("");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        height: "100vh",
        padding: "1rem",
        backgroundColor: "black", // Set the background color to black
      }}
    >
      <Box
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#fff", // Keep the form white for contrast
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "black" }}>
          Edit Profile
        </Typography>
        <Typography variant="subtitle1" gutterBottom style={{ color: "black" }}>
          Update your profile information.
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: "1rem" }}
          centered
          TabIndicatorProps={{
            style: {
              backgroundColor: "Black", // Highlight tabs with white
            },
          }}
        >
          <Tab label="Username" style={{ color: "Black" }} />
          <Tab label="Email" style={{ color: "Black" }} />
          <Tab label="Password" style={{ color: "Black" }} />
        </Tabs>

        {activeTab === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("username");
            }}
          >
            <TextField
              label="Current Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentUsername"
              value={userInfo.currentUsername}
              onChange={handleInputChange}
              error={!!errors.currentUsername}
              helperText={errors.currentUsername}
            />
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentPassword"
              value={userInfo.currentPassword}
              onChange={handleInputChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
            />
            <TextField
              label="New Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="newUsername"
              value={userInfo.newUsername}
              onChange={handleInputChange}
              error={!!errors.newUsername}
              helperText={errors.newUsername}
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
              label="Current Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentUsername"
              value={userInfo.currentUsername}
              onChange={handleInputChange}
              error={!!errors.currentUsername}
              helperText={errors.currentUsername}
            />
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentPassword"
              value={userInfo.currentPassword}
              onChange={handleInputChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
            />
            <TextField
              label="New Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
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

        {activeTab === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("password");
            }}
          >
            <TextField
              label="Current Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentUsername"
              value={userInfo.currentUsername}
              onChange={handleInputChange}
              error={!!errors.currentUsername}
              helperText={errors.currentUsername}
            />
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="currentPassword"
              value={userInfo.currentPassword}
              onChange={handleInputChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="newPassword"
              value={userInfo.newPassword}
              onChange={handleInputChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              style={{ marginTop: "1rem" }}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </Box>
    </Grid>
  );
}
