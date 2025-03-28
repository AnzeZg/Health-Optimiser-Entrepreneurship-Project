import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
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

// Mock data for the chart
const calorieData = [
  { name: 'Mon', calories: 2100 },
  { name: 'Tue', calories: 1950 },
  { name: 'Wed', calories: 2200 },
  { name: 'Thu', calories: 2050 },
  { name: 'Fri', calories: 2300 },
  { name: 'Sat', calories: 2150 },
  { name: 'Sun', calories: 2000 },
];

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Exercise Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Exercise Summary
            </Typography>
            <Typography variant="h3" color="primary">
              45 min
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total exercise time today
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Exercises
              </Typography>
              <Card variant="outlined" sx={{ mb: 1 }}>
                <CardContent>
                  <Typography variant="body1">Morning Run</Typography>
                  <Typography variant="body2" color="text.secondary">
                    30 minutes • 300 calories
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1">Yoga</Typography>
                  <Typography variant="body2" color="text.secondary">
                    15 minutes • 100 calories
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        {/* Nutritional Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nutritional Overview
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary">
                2,150
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Calories consumed today
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Macronutrients
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Protein: 150g / 180g
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={83}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Carbs: 250g / 300g
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={83}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fat: 70g / 80g
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={87}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>

            <Box sx={{ height: 200 }}>
              <Typography variant="subtitle2" gutterBottom>
                Calorie Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#2196f3"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 