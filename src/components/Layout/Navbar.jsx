import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  Agriculture,
  ExitToApp,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
    handleClose();
  };

  const handleDashboard = () => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
    handleClose();
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Agriculture sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={handleDashboard}
        >
          Farmer Management System
        </Typography>

        {user ? (
          <Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              aria-label="account menu"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {JSON.parse(localStorage.getItem('user'))?.name || 'User'}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {isAdmin() ? 'Admin' : 'User'}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleDashboard}>
                <Dashboard sx={{ mr: 1 }} fontSize="small" />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;  