import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  FitnessCenter as FitnessCenterIcon,
  Bedtime as BedtimeIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as EmojiEventsIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Meal Tracking', icon: <RestaurantIcon />, path: '/meals' },
    { text: 'Workout Logging', icon: <FitnessCenterIcon />, path: '/workouts' },
    { text: 'Sleep Tracking', icon: <BedtimeIcon />, path: '/sleep' },
    { text: 'Competitions', icon: <EmojiEventsIcon />, path: '/competitions' },
    { text: 'Chat Assistant', icon: <ChatIcon />, path: '/chat' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
        boxShadow: '2px 0 12px 0 rgba(66,165,245,0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: 96 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
              mb: 1,
            }}
          >
            <FitnessCenterIcon sx={{ color: '#1976d2', fontSize: 32 }} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              background: 'linear-gradient(90deg, #fff 40%, #fce4ec 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              mb: 0.5,
            }}
          >
            Well Sync
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              color: '#fff',
              '&.Mui-selected, &.Mui-selected:hover': {
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: '0 4px 24px 0 rgba(66,165,245,0.10)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 1,
                mr: 1,
              }}
            >
              <FitnessCenterIcon sx={{ color: '#1976d2', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                background: 'linear-gradient(90deg, #fff 40%, #fce4ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 4px rgba(66,165,245,0.10)',
                display: 'flex',
                alignItems: 'center',
                pl: 0,
              }}
            >
              {menuItems.find((item) => item.path === location.pathname)?.text || 'Well Sync'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 