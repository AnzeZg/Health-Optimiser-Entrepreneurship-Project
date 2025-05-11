import React, { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../store/useStore';
import { format, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const INACTIVE_COLORS = ['#cce5ff', '#d4f4ea', '#fff2cc'];

const Dashboard: React.FC = () => {
  const { routine, meals, workouts, friends, getTodayScore, calculateTodayScore } = useStore();
  const navigate = useNavigate();

  // Force score calculation when component mounts
  useEffect(() => {
    calculateTodayScore();
  }, [calculateTodayScore]);

  // Calculate today's score
  const todayScore = getTodayScore();

  // Get the last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'EEE'),
      calories: meals
        .filter((meal) => meal.date === format(date, 'yyyy-MM-dd'))
        .reduce((sum, meal) => sum + meal.calories, 0),
      workouts: workouts.filter(
        (workout) => workout.date === format(date, 'yyyy-MM-dd')
      ).length,
    };
  }).reverse();

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((meal) => meal.date === today);
  const todayWorkouts = workouts.filter((workout) => workout.date === today);

  const totalCaloriesToday = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalWorkoutsToday = todayWorkouts.length;

  // Prepare score breakdown data for the pie chart with active/inactive segments
  const scoreBreakdown = [
    // Meal segments (tracked and untracked)
    { name: 'Meals (Tracked)', value: todayScore.mealScore, category: 'meal', status: 'tracked' },
    { name: 'Meals (Untracked)', value: 40 - todayScore.mealScore, category: 'meal', status: 'untracked' },
    
    // Workout segments (tracked and untracked)
    { name: 'Workouts (Tracked)', value: todayScore.workoutScore, category: 'workout', status: 'tracked' },
    { name: 'Workouts (Untracked)', value: 40 - todayScore.workoutScore, category: 'workout', status: 'untracked' },
    
    // Sleep segments (tracked and untracked)
    { name: 'Sleep (Tracked)', value: todayScore.sleepScore, category: 'sleep', status: 'tracked' },
    { name: 'Sleep (Untracked)', value: 20 - todayScore.sleepScore, category: 'sleep', status: 'untracked' },
  ].filter(segment => segment.value > 0); // Only include segments with a value > 0

  // Add empty segments if no tracking has been done
  if (scoreBreakdown.length === 0) {
    scoreBreakdown.push(
      { name: 'Meals', value: 40, category: 'meal', status: 'untracked' },
      { name: 'Workouts', value: 40, category: 'workout', status: 'untracked' },
      { name: 'Sleep', value: 20, category: 'sleep', status: 'untracked' }
    );
  }

  // Sort friends by score
  const sortedFriends = [...friends].sort((a, b) => b.score - a.score);

  // Custom pie chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="body2">{data.name}</Typography>
          <Typography variant="body2" fontWeight="bold">{`${data.value} points`}</Typography>
        </Box>
      );
    }
    return null;
  };

  // Function to get the color for a pie chart segment
  const getSegmentColor = (entry: any, index: number) => {
    const categoryIndex = entry.category === 'meal' ? 0 : entry.category === 'workout' ? 1 : 2;
    return entry.status === 'tracked' ? COLORS[categoryIndex] : INACTIVE_COLORS[categoryIndex];
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      py: 4,
      px: { xs: 1, sm: 3 },
    }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FitnessCenterIcon color="primary" fontSize="large" /> Dashboard
          </Typography>
          {!routine && (
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 4, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)' }}
              onClick={() => navigate('/calendar')}
              startIcon={<TrendingUpIcon />}
            >
              Set Up Your Workout Plan
            </Button>
          )}
        </Box>
        <Grid container spacing={4}>
          {/* Today's Score */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                  <EmojiEventsIcon color="secondary" sx={{ mr: 1, verticalAlign: 'middle' }} /> Today's Health Score
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={todayScore.score}
                    size={120}
                    thickness={5}
                    sx={{ color: todayScore.score > 70 ? 'success.main' : todayScore.score > 40 ? 'warning.main' : 'error.main' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" color="text.secondary">
                      {todayScore.score}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                  Score resets daily. Track more activities to improve your score!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Score Breakdown */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                  <TrendingUpIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} /> Score Breakdown
                </Typography>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getSegmentColor(entry, index)} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, mr: 1, bgcolor: COLORS[0], borderRadius: '50%' }} />
                    Meals: {todayScore.mealScore}/40 points
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, mr: 1, bgcolor: COLORS[1], borderRadius: '50%' }} />
                    Workouts: {todayScore.workoutScore}/40 points
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, mr: 1, bgcolor: COLORS[2], borderRadius: '50%' }} />
                    Sleep: {todayScore.sleepScore}/20 points
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Friend Leaderboard */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, display: 'inline-flex', mr: 1, verticalAlign: 'middle' }}>
                    <EmojiEventsIcon />
                  </Avatar>
                  Friend Scores
                </Typography>
                <List>
                  {sortedFriends.map((friend, index) => (
                    <React.Fragment key={friend.id}>
                      <ListItem sx={{ borderRadius: 2, mb: 1, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3, bgcolor: '#f3e5f5' } }}>
                        <ListItemAvatar>
                          <Avatar src={friend.avatar} alt={friend.name} />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={<Typography fontWeight={600}>{friend.name}</Typography>} 
                          secondary={`Active ${friend.lastActive}`} 
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: friend.score > 70 ? 'success.light' : friend.score > 40 ? 'warning.light' : 'error.light',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body1" fontWeight="bold">
                            {friend.score}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < sortedFriends.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {/* Today's Summary */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Today's Calories
                </Typography>
                <Typography variant="h3" color="primary">
                  {totalCaloriesToday}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  kcal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Today's Workouts
                </Typography>
                <Typography variant="h3" color="primary">
                  {totalWorkoutsToday}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Weekly Progress Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Weekly Progress
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7Days}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="calories"
                      stroke="#8884d8"
                      name="Calories"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="workouts"
                      stroke="#82ca9d"
                      name="Workouts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          {/* Routine Progress */}
          {routine && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Routine Progress
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Meals Completed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (routine.meals.filter((meal) => meal.completed).length /
                          routine.meals.length) *
                        100
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Workouts Completed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (routine.workouts.filter((workout) => workout.completed)
                          .length /
                          routine.workouts.length) *
                        100
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 