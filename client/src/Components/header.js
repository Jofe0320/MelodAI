import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useAuth } from '../AuthProvider';
import PropTypes from 'prop-types'

function Header({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigating between routes

  const { logout } = useAuth();

  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    handleCloseMenu(); // Close the dropdown menu
    await logout(); // Call the logout function to clear the session
    navigate('/'); // Redirect to the login page
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleCloseMenu(); // Close the menu
    navigate('/edit-profile'); // Navigate to the Edit Profile page
  };

  const handleUserSongs = () => {
    handleCloseMenu(); // Close the menu
    navigate('/usersongs'); // Navigate to the User Songs page
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
      <Toolbar>
        {/* Menu Icon for Drawer */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>

        {/* App Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MelodAI
        </Typography>

        {/* User Icon and Dropdown Menu */}
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
            sx={{ fontSize: '2rem' }}
          >
            <AccountCircle sx={{ fontSize: 40 }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem disabled>{user ? user : "Guest"}</MenuItem>
            <MenuItem onClick={handleEditProfile}>Edit User</MenuItem>
            <MenuItem onClick={handleUserSongs}>Songs</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>

        {/* Drawer for Side Menu */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem button onClick={() => navigate('/')}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={() => navigate('/examples')}>
                <ListItemText primary="Examples" />
              </ListItem>
              <ListItem button onClick={() => navigate('/about-us')}>
                <ListItemText primary="About Us" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    username: PropTypes.string,
  }), // Allow user to be null or undefined
};

export default Header;
