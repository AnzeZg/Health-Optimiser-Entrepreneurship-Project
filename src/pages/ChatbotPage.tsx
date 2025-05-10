import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chatbot } from '../components/Chatbot';

const ChatbotPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Health Assistant Chat
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Chat with our AI assistant to get help with your health and wellness journey.
      </Typography>
      <Chatbot />
    </Box>
  );
};

export default ChatbotPage; 