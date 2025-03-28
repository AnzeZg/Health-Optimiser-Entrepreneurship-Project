import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';
import { format, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { routine, meals, workouts } = useStore();
  const navigate = useNavigate();

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        {!routine && (
          <Button
            variant="contained"
            onClick={() => navigate('/calendar')}
          >
            Set Up Your Routine
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* Today's Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
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
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
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
    </Box>
  );
};

export default Dashboard; 