import React from 'react';
import { Box, Typography } from '@mui/material';
import { WorkoutQuestionnaire } from '../components/WorkoutQuestionnaire';

const WorkoutQuestionnairePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Your Workout Plan
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Let's create a personalized workout plan that fits your goals and lifestyle.
        This questionnaire will help us understand your needs better.
      </Typography>
      <WorkoutQuestionnaire />
    </Box>
  );
};

export default WorkoutQuestionnairePage; 