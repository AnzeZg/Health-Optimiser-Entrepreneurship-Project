import React from 'react';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'DASHBOARD', path: '/' },
  { label: 'HEALTH OVERVIEW', path: '/health' },
  { label: 'ACTIVITY & FITNESS', path: '/activity' },
  { label: 'MEDICAL & WELLNESS', path: '/medical' },
];

const TopNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, sm: 4 },
        py: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 6 },
        mt: { xs: 1, sm: 3 },
        background: 'transparent',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {navLinks.map((link) => {
        const isActive =
          location.pathname === link.path ||
          (link.path === '/' && location.pathname === '/');
        return (
          <Button
            key={link.path}
            onClick={() => navigate(link.path)}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              px: { xs: 3, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              letterSpacing: 1,
              boxShadow: isActive
                ? '0 4px 24px 0 rgba(77,163,250,0.18)'
                : 'none',
              bgcolor: isActive ? '#4da3fa' : 'transparent',
              color: isActive ? '#fff' : '#222',
              textTransform: 'none',
              transition:
                'background 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1), color 0.25s cubic-bezier(.4,0,.2,1)',
              '&:hover': {
                bgcolor: isActive ? '#4da3fa' : '#f0f2f7',
                color: isActive ? '#fff' : '#222',
                boxShadow: isActive
                  ? '0 6px 32px 0 rgba(77,163,250,0.22)'
                  : '0 2px 8px 0 rgba(0,0,0,0.04)',
              },
            }}
            disableElevation
          >
            {link.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default TopNavBar; 