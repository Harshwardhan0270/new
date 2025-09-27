import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  AccountCircle, 
  School, 
  Notifications,
  Dashboard,
  LibraryBooks,
  Add,
  Logout,
  Person
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              EduFlow
            </Link>
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/courses"
            startIcon={<LibraryBooks />}
            sx={{ 
              borderRadius: 3,
              px: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              }
            }}
          >
            Courses
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                startIcon={<Dashboard />}
                sx={{ 
                  borderRadius: 3,
                  px: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                Dashboard
              </Button>
              
              {user?.role === 'instructor' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/create-course"
                  startIcon={<Add />}
                  sx={{ 
                    borderRadius: 3,
                    px: 2,
                    background: alpha(theme.palette.common.white, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.2),
                    }
                  }}
                >
                  Create Course
                </Button>
              )}

              <IconButton
                color="inherit"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    fontWeight: 500,
                    mr: 1,
                  }}
                />
                <IconButton
                  onClick={handleMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </Avatar>
                </IconButton>
              </Box>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 200,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </Box>
                <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                  <Logout sx={{ mr: 2, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                variant="outlined"
                sx={{ 
                  borderRadius: 3,
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.5),
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register"
                variant="contained"
                sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;