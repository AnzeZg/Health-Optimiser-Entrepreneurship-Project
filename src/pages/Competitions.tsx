import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Paper,
} from '@mui/material';
import { useStore } from '../store/useStore';

// Mock data for competitions
const mockCompetitions = [
  {
    id: 1,
    title: 'Protein Streak Challenge',
    description: 'Track your protein intake for 7 days straight',
    image: '💪',
    dateRange: 'Mar 1 - Mar 7',
    reward: '🎁 500 Points + Protein Master Badge',
    status: 'active',
    type: 'nutrition',
    progress: 60,
    joined: true,
  },
  {
    id: 2,
    title: 'Weekly Workout Warrior',
    description: 'Complete 5 workouts this week',
    image: '🏃',
    dateRange: 'Mar 1 - Mar 7',
    reward: '🎁 300 Points + Workout Warrior Badge',
    status: 'upcoming',
    type: 'fitness',
    progress: 0,
    joined: false,
  },
  {
    id: 3,
    title: 'Team Step Challenge',
    description: 'Join a team and compete for most steps',
    image: '👥',
    dateRange: 'Mar 8 - Mar 14',
    reward: '🎁 1000 Points + Team Trophy',
    status: 'upcoming',
    type: 'team',
    progress: 0,
    joined: false,
  },
];

const Competitions: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { competitions, joinCompetition, leaveCompetition, updateCompetitionProgress } = useStore();

  const handleStatusFilterChange = (event: React.MouseEvent<HTMLElement>, newStatus: string) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
    }
  };

  const handleTypeFilterChange = (event: React.MouseEvent<HTMLElement>, newType: string) => {
    if (newType !== null) {
      setTypeFilter(newType);
    }
  };

  const filteredCompetitions = mockCompetitions.filter((competition) => {
    if (statusFilter !== 'all' && competition.status !== statusFilter) return false;
    if (typeFilter !== 'all' && competition.type !== typeFilter) return false;
    return true;
  });

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🏆 Competitions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Join challenges to win points, badges, and real prizes!
        </Typography>
      </Box>

      {/* Featured Competition Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Featured Challenge: Spring Fitness Blitz
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Join our biggest challenge yet! Complete daily workouts and nutrition goals to win amazing prizes.
            </Typography>
            <Button variant="contained" color="secondary">
              Join Now
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h1">🏃</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Filter and Sort Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="active">Active</ToggleButton>
              <ToggleButton value="upcoming">Upcoming</ToggleButton>
              <ToggleButton value="completed">Completed</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={handleTypeFilterChange}
              fullWidth
            >
              <ToggleButton value="all">All Types</ToggleButton>
              <ToggleButton value="fitness">Fitness</ToggleButton>
              <ToggleButton value="nutrition">Nutrition</ToggleButton>
              <ToggleButton value="team">Team</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="ending">Ending Soon</MenuItem>
                <MenuItem value="popular">Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Competition Cards Grid */}
      <Grid container spacing={3}>
        {filteredCompetitions.map((competition) => (
          <Grid item xs={12} md={4} key={competition.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h1" align="center" sx={{ fontSize: '3rem', mb: 2 }}>
                  {competition.image}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {competition.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {competition.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {competition.dateRange}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {competition.reward}
                </Typography>
                {competition.joined && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={competition.progress}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Progress: {competition.progress}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={competition.joined ? 'outlined' : 'contained'}
                  color="primary"
                  onClick={() => competition.joined ? leaveCompetition(competition.id) : joinCompetition(competition.id)}
                >
                  {competition.joined ? 'Continue' : 'Join Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer CTA */}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          🏅 Ready to win more?
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Join your next challenge today!
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Browse Competitions
        </Button>
      </Paper>
    </Container>
  );
};

export default Competitions; 